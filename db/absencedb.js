require("dotenv").config();
const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const utils = require("../utils/speedyutils.js");
const client = utils.client;
var parseISO = require('date-fns/parseISO');
var isValid = require('date-fns/isValid');
var format = require('date-fns/format');
var SqlString = require('sqlstring');

let absencedb = new sqlite3.Database('./db/absence.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the absence database.');
});

class CreateDatabase {
    startup() {
        absencedb.serialize(function () {
            absencedb.run("CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start` TEXT, `end` TEXT, `comment` TEXT)");
            absencedb.run("CREATE TABLE IF NOT EXISTS `latecomers` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start` TEXT, `comment` TEXT)");
        });
    }
}

class DatabaseTools {
    makeFriendlyDates(date) {
        //Ensures that dates are in the appropriate time zone (locally) by adding an ugly ISO timestamp.
        let friendlyDateTemp = date + 'T20:52:29.478Z';
        let friendlyDate = format(new Date(friendlyDateTemp), 'iii, MMM dd yyyy');
        return (friendlyDate)
    }

    validateDates(message, start, end) {
        //Make sure given dates are dates.
        if (!isValid(parseISO(start))) {
            message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
        }
        if (!isValid(parseISO(end))) {
            message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
        }
        if ((isValid(parseISO(start))) && (isValid(parseISO(end)))) {
            return (true);
        }
    }

    generateResponse(message, this_command, undo_command, start, end, reason) {
        if (!end) {
            end = start;
            console.log(start,end);
        }
        if (message.channel.type === 'dm') {
            if (start != end) {
                message.reply(`Ok, I've marked you ${this_command} from ${this.makeFriendlyDates(start)} until ${this.makeFriendlyDates(end)}.  \n\nTo undo this, type: !${undo_command} ${start} ${end} `);
            } else {
                message.reply(`Ok, I've marked you ${this_command} on ${this.makeFriendlyDates(start)}.  \n\nTo undo this, type: !${undo_command} ${start}`);
            }
        } else {
            if (start == end) {
                message.member.send(`Ok, I've marked you ${this_command} from ${this.makeFriendlyDates(start)} until ${this.makeFriendlyDates(end)}.  \n\nTo undo this, type: !${undo_command} ${start} ${end} `);
            } else {
                message.member.send(`Ok, I've marked you ${this_command} on ${this.makeFriendlyDates(start)}.  \n\nTo undo this, type: !${undo_command} ${start}`);
            }
        }
        if (this_command === 'absent') {
            if (start != end) {
                client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent from ${this.makeFriendlyDates(start)} until ${this.makeFriendlyDates(end)}. They commented: ${reason}`)
            } else {
                client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent on ${this.makeFriendlyDates(start)}. They commented: ${reason}`)
            }
        }
        if (this_command === 'late') {
            client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be late on ${this.makeFriendlyDates(start)}. They commented: ${reason}`)
        }
    }

    addAbsence(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        let endDate = args[1];
        if (!isValid(parseISO(args[1]))) {
            endDate = startDate;
        }

        //Process a comment, if supplied.
        //Absences with and end date:
        if (isValid(parseISO(args[1]))) {
            var comment = args.slice(2).join(' ');
        //Absences without an end date:
        } else {
            var comment = args.slice(1).join(' ');
        }

        //Make sure there's something in the comment field, even if empty.
        if (comment) {
            var safe_reason = SqlString.escape(comment);
        } else {
            var safe_reason = ' ';
        }

        //Make sure dates are good.
        if (this.validateDates(message, startDate, endDate)) {
            absencedb.run(`INSERT INTO absences(name, start, end, comment) VALUES ("${message.author.username}", "${startDate}", "${endDate}", "${safe_reason}")`);
            this.generateResponse(message, "absent", "present", startDate, endDate, safe_reason);
        }                
    }

    addPresent(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        let endDate = args[1];
        if (!args[1]) {
            endDate = startDate;
        }
        //Make sure given dates are dates.
        if (this.validateDates(message, startDate, endDate)) {
            //If dates are good, do the update.
            absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start = "${startDate}" AND end = "${endDate}")`);
            //Send message to confirm.
            this.generateResponse(message, "present", "absent", startDate, endDate);
        }
    }

    ontime(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        //Make sure given dates are dates.
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a date in the format YYYY-MM-DD.");
        }
        //Only update db if we have valid start and end dates.
        if (isValid(parseISO(startDate))) {
            absencedb.run(`DELETE FROM latecomers WHERE (name = "${message.author.username}" AND start = "${startDate}")`);
            message.author.send(`Ok, I've got you down as on-time on ${this.makeFriendlyDates(startDate)}. See you then!`)
        }
    }

    show(message) {
        let sql = `SELECT * FROM absences WHERE end >= date('now','-1 day') ORDER BY name`;

        absencedb.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            const embed = new Discord.MessageEmbed()
                .setColor(0xFFFFFF)
                .setTitle("Upcoming absences")
                .setFooter("These absences are known to the Inifite Speedyflight. Use this information wisely.")
            rows.forEach((row) => {
                embed.addFields({
                    name: row.name,
                    value: "\t\tStart Date " + this.makeFriendlyDates(row.start) + "\nEnd Date " + this.makeFriendlyDates(row.end) + "\nComments " + row.comment,
                    inline: false
                })
            });
            message.reply(embed);
        });
        let late_sql = `SELECT * FROM latecomers WHERE start >= date('now','-1 day') ORDER BY name`;

        absencedb.all(late_sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            const embed = new Discord.MessageEmbed()
                .setColor(0xFFFFFF)
                .setTitle("Upcoming tardiness")
                .setFooter("This tardiness is known to the Inifite Speedyflight. Use this information wisely.")
            rows.forEach((row) => {
                embed.addFields({
                    name: row.name,
                    value: "\t\tStart Date " + this.makeFriendlyDates(row.start) + "\nComments " + row.comment,
                    inline: false
                })
            });
            message.reply(embed);
        });
    }

    tardy(message, args) {
        //Make sure we have a date.
        let startDate = args[0];

        //Make sure given dates are dates.
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a date in the format YYYY-MM-DD.");
        }
        //Process a comment, if supplied.
        let comment = args.slice(1).join(' ');

        if (comment) {
            var safe_reason = SqlString.escape(comment);
        } else {
            var safe_reason = ' ';
        }
        if (isValid(parseISO(startDate))) {
            absencedb.run(`INSERT INTO latecomers(name, start, comment) VALUES ("${message.author.username}", "${startDate}", "${safe_reason}")`);
            this.generateResponse(message, "late", "ontime", startDate,undefined,   safe_reason);
            //message.author.send(`Ok, I've got you down as coming late on ${this.makeFriendlyDates(startDate)}. You've indicated the reason is ${safe_reason}.\n\nIf you want to cancel this, type: !ontime ${startDate}`)
        }
    }
}

module.exports = {
    CreateDatabase,
    DatabaseTools,
};