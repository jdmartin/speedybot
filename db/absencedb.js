const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
var parseISO = require('date-fns/parseISO');
var isValid = require('date-fns/isValid');
var SqlString = require('sqlstring');
require("dotenv").config();
const utils = require("../utils/speedyutils.js");
const client = utils.client;

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
    processDates(message, start, end) {
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

    generateResponse(message, this_command, undo_command, start, end) {
        if (this_command === 'late') {
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                max: 1,
                time: 300000
            });
            collector.on('collect', m => {
                if (m.content) {
                    var safe_reason = SqlString.escape(m.content);
                    absencedb.run(`INSERT INTO latecomers(name, start, comment) VALUES ("${message.author.username}", "${startDate}", "${safe_reason}")`);
                    message.author.send(`Ok, I've got you down as coming late on ${startDate}. You've indicated the reason is ${safe_reason}.\n\nIf you want to cancel this, type: !ontime ${startDate}`)
                    client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be late on ${startDate}. They commented: ${safe_reason}`)
                    collector.stop();
                }
            })
        }
        
        if (message.channel.type === 'dm') {
            if (start != end) {
                message.reply(`Ok, I've marked you ${this_command} from ${start} until ${end}.  \n\nTo undo this, type: !${undo_command} ${start} ${end} `);
            } else {
                message.reply(`Ok, I've marked you ${this_command} on ${start}.  \n\nTo undo this, type: !${undo_command} ${start}`);
            }
        } else {
            if (!start != end) {
                message.member.send(`Ok, I've marked you ${this_command} from ${start} until ${end}.  \n\nTo undo this, type: !${undo_command} ${start} ${end} `);
            } else {
                message.member.send(`Ok, I've marked you ${this_command} on ${start}.  \n\nTo undo this, type: !${undo_command} ${start}`);
            }
        }
    }

    addAbsence(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        let endDate = args[1];
        if (!args[1]) {
            endDate = startDate;
        }
        //Make sure dates are good.
        if (this.processDates(message, startDate, endDate)) {
            message.author.send("Ok, I've got the date(s). If you'd like to add a comment, reply to me in the next five minutes.");
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                max: 1,
                time: 300000
            });
            collector.on('collect', m => {
                if (m.content) {
                    var safe_reason = SqlString.escape(m.content);
                    absencedb.run(`INSERT INTO absences(name, start, end, comment) VALUES ("${message.author.username}", "${startDate}", "${endDate}", "${safe_reason}")`);
                    this.generateResponse(message, "absent", "present", startDate, endDate);
                    client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent from ${startDate} until ${endDate}. They commented: ${safe_reason}`)
                    collector.stop();
                }
            })
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
        if (this.processDates(message, startDate, endDate)) {
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
            message.author.send(`Ok, I've got you down as on-time on ${startDate}. See you then!`)
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
                    value: "\t\tStart Date " + row.start + "\nEnd Date " + row.end + "\nComments " + row.comment,
                    inline: false
                })
            });
            if (message.channel.type === 'dm') {
                message.channel.send(embed);
            } else {
                message.member.send(embed);
            }
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
                    value: "\t\tStart Date " + row.start + "\nComments " + row.comment,
                    inline: false
                })
            });
            if (message.channel.type === 'dm') {
                message.channel.send(embed);
            } else {
                message.member.send(embed);
            }
        });
    }

    tardy(message, args) {
        //Make sure we have a date.
        let startDate = args[0];
        let endDate = args[1];
        if (!args[1]) {
            endDate = startDate;
        }
        //Make sure given dates are dates.
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a date in the format YYYY-MM-DD.");
        }
        if (isValid(parseISO(startDate))) {
            this.generateResponse(message, "late", "ontime", startDate, endDate);
        }
    }
}

module.exports = {
    CreateDatabase,
    DatabaseTools,
};