require("dotenv").config();
const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const utils = require("../utils/speedyutils.js");
const client = utils.client;
var parseISO = require('date-fns/parseISO');
var isValid = require('date-fns/isValid');
var format = require('date-fns/format');
var nextTuesday = require('date-fns/nextTuesday');
var nextThursday = require('date-fns/nextThursday');
var nextSunday = require('date-fns/nextSunday');
var SqlString = require('sqlstring');
const { da } = require("date-fns/locale");


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

class DataFormattingTools {
    calculateDate(day) {
        let today = new Date();
        let simple_today = today.toISOString().split('T')[0];
        let lower_selection = day.toLowerCase();

        switch(lower_selection) {
            case 'today':
                console.log(simple_today);
            case 'tue':
                console.log(nextTuesday(parseISO(date)));
            case 'tuesday':
                console.log(nextTuesday(parseISO(date)));
            case 'thu':
                console.log(nextThursday(parseISO(date)));
            case 'thursday':
                console.log(nextThursday(parseISO(date)));
            case 'sun':
                console.log(nextSunday(parseISO(date)));
            case 'sunday':
                console.log(nextSunday(parseISO(date)));
        }
    }

    generateResponse(message, this_command, undo_command, start, end, reason) {
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        //Select the appropriate type of response, and shorten if it's a single day.
        if (message.channel.type === 'dm') {
            if (start != end) {
                message.reply(`Ok, I've marked you ${this_command} from ${tools.makeFriendlyDates(start)} until ${tools.makeFriendlyDates(end)}.  \n\nTo undo this, type: !${undo_command} ${start} ${end} `);
            } else {
                message.reply(`Ok, I've marked you ${this_command} on ${tools.makeFriendlyDates(start)}.  \n\nTo undo this, type: !${undo_command} ${start}`);
            }
        } else {
            if (start != end) {
                message.member.send(`Ok, I've marked you ${this_command} from ${tools.makeFriendlyDates(start)} until ${tools.makeFriendlyDates(end)}.  \n\nTo undo this, type: !${undo_command} ${start} ${end} `);
            } else {
                message.member.send(`Ok, I've marked you ${this_command} on ${tools.makeFriendlyDates(start)}.  \n\nTo undo this, type: !${undo_command} ${start}`);
            }
        }
        //Handle channel posts for absences and lates. Shorten if only a single day.
        if (this_command === 'absent') {
            if (start != end) {
                client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent from ${tools.makeFriendlyDates(start)} until ${tools.makeFriendlyDates(end)}. They commented: ${reason}`)
            } else {
                client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent on ${tools.makeFriendlyDates(start)}. They commented: ${reason}`)
            }
        }
        if (this_command === 'late') {
            client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be late on ${tools.makeFriendlyDates(start)}. They commented: ${reason}`)
        }
    }

    makeFriendlyDates(date) {
        //Ensures that dates are in the appropriate time zone (locally) by adding an ugly ISO timestamp.
        let friendlyDateTemp = date + 'T20:52:29.478Z';
        let friendlyDate = format(new Date(friendlyDateTemp), 'iii, MMM dd yyyy');
        return (friendlyDate)
    }

    validateDates(message, start, end) {
        //Handle special days
        const days = ['today', 'tue', 'tuesday', 'thu', 'thursday', 'sun', 'sunday'];
        if (days.includes(start)) {
            start = this.calculateDate(start);
        }
        //Make sure given dates are dates.
        if (!isValid(parseISO(start))) {
            message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
            return;
        }
        if (!isValid(parseISO(end))) {
            message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
        }
        if ((isValid(parseISO(start))) && (isValid(parseISO(end)))) {
            return (true);
        }
    }
}

const tools = new DataFormattingTools();

class DataEntryTools {
    addAbsence(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        let endDate = args[1];
        if (!isValid(parseISO(args[1]))) {
            endDate = startDate;
        }

        //Process a comment, if supplied.
        //Absences with an end date:
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
        if (tools.validateDates(message, startDate, endDate)) {
            absencedb.run(`INSERT INTO absences(name, start, end, comment) VALUES ("${message.author.username}", "${startDate}", "${endDate}", "${safe_reason}")`);
            tools.generateResponse(message, "absent", "present", startDate, endDate, safe_reason);
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
        if (tools.validateDates(message, startDate, endDate)) {
            //If dates are good, do the update.
            absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start = "${startDate}" AND end = "${endDate}")`);
            //Send message to confirm.
            tools.generateResponse(message, "present", "absent", startDate, endDate);
        }
    }

    ontime(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        //Make sure given dates are dates.
        tools.validateDates(message, startDate, undefined);
        //Only update db if we have valid start and end dates.
        if (isValid(parseISO(startDate))) {
            absencedb.run(`DELETE FROM latecomers WHERE (name = "${message.author.username}" AND start = "${startDate}")`);
            message.author.send(`Ok, I've got you down as on-time on ${tools.makeFriendlyDates(startDate)}. See you then!`)
        }
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
            tools.generateResponse(message, "late", "ontime", startDate, undefined, safe_reason);
        }
    }
}

class DataDisplayTools {
    show(message) {
        //Get all absences for today and later.
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
                    value: "\t\tStart Date " + tools.makeFriendlyDates(row.start) + "\nEnd Date " + tools.makeFriendlyDates(row.end) + "\nComments " + row.comment,
                    inline: false
                })
            });
            message.reply(embed);
        });
        //Get all tardiness from today and later.
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
                    value: "\t\tStart Date " + tools.makeFriendlyDates(row.start) + "\nComments " + row.comment,
                    inline: false
                })
            });
            message.reply(embed);
        });
    }
}

module.exports = {
    CreateDatabase,
    DataDisplayTools,
    DataEntryTools,
};