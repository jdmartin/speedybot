require("dotenv").config();
const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const utils = require("../utils/speedyutils.js");
const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();
const client = utils.client;

//Date-related
const offset = 'T11:52:29.478Z'; 
var parseISO = require('date-fns/parseISO');
var isValid = require('date-fns/isValid');
var format = require('date-fns/format');

//Other Tools
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

class DataEntryTools {
    absent(message, args) {
        //Make sure we have start and end dates.
        if (dateTools.checkIsMonth(args[0])) {
            var startYear = dateTools.determineYear(args[0], args[1]);
            if (dateTools.checkIsDate(args[0], args[1], startYear)) {
                var rebuilt_start = args[0] + ' ' + args[1] + ' ' + startYear;
                var startDate = dateTools.validateDates(message, rebuilt_start, undefined);
            }
            //Process Comments
            var comment = args.slice(2).join(' ');
        }
        if (dateTools.checkIsMonth(args[2])) {
            //Make sure end year is equal or greater to start year.
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(args[2], args[3]);
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(args[2], args[3], endYear)) {
                var rebuilt_end = args[2] + ' ' + args[3] + ' ' + endYear;
                var endDate = dateTools.validateDates(message, undefined, rebuilt_end);
                //Process Comments
                var comment = args.slice(4).join(' ');
            }
        }
        if (endDate == undefined) {
            endDate = startDate;
            var comment = args.slice(2).join(' ');
        }
        //Make sure there's something in the comment field, even if empty.
        if (comment) {
            var safe_reason = SqlString.escape(comment);
        } else {
            var safe_reason = ' ';
        }
        //Make sure dates are good.
        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            absencedb.run(`INSERT INTO absences(name, start, end, comment) VALUES ("${message.author.username}", "${startDate}", "${endDate}", "${safe_reason}")`);
            this.generateResponse(message, "absent", "present", startDate, endDate, safe_reason);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    late(message, args) {
        var currentYear = dateTools.determineYear(args[0], args[1]);
        //Make sure we have a date.
        if (dateTools.checkIsMonth(args[0])) {
            if (dateTools.checkIsDate(args)) {
                var rebuilt_date = args[0] + ' ' + args[1] + ' ' + currentYear;
                var startDate = dateTools.validateDates(message, rebuilt_date, undefined);
                //Process a comment, if supplied.
                var comment = args.slice(2).join(' ');
            }
        }
        if (comment) {
            var safe_reason = SqlString.escape(comment);
        } else {
            var safe_reason = ' ';
        }
        //Only update db if we have a valid date.
        if (isValid(parseISO(startDate))) {
            absencedb.run(`INSERT INTO latecomers(name, start, comment) VALUES ("${message.author.username}", "${startDate}", "${safe_reason}")`);
            this.generateResponse(message, "late", "ontime", startDate, undefined, safe_reason);
        }
    }

    ontime(message, args) {
        var currentYear =  dateTools.determineYear(args[0], args[1]);
        //Make sure we have dates.
        if (dateToolscheckIsMonth(args[0])) {
            if (dateToolscheckIsDate(args)) {
                var rebuilt_date = args[0] + ' ' + args[1] + ' ' + currentYear;
                var startDate = dateTools.validateDates(message, rebuilt_date, undefined);
            }
        }
        //Only update db if we have a valid date.
        if (isValid(parseISO(startDate))) {
            absencedb.run(`DELETE FROM latecomers WHERE (name = "${message.author.username}" AND start = "${startDate}")`);
            message.author.send(`Ok, I've got you down as on-time on ${dateTools.makeFriendlyDates(startDate)}. See you then!`)
        }
    }

    present(message, args) {
        if (dateTools.checkIsMonth(args[0])) {
            var startYear = dateTools.determineYear(args[0], args[1]);
            if (dateTools.checkIsDate(args[0], args[1], startYear)) {
                var rebuilt_start = args[0] + ' ' + args[1] + ' ' + startYear;
                var startDate = dateTools.validateDates(message, rebuilt_start, undefined);
            }
        }
        if (dateTools.checkIsMonth(args[2])) {
            //Make sure end year is equal or greater to start year.
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(args[2], args[3]);
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(args[2], args[3], endYear)) {
                var rebuilt_end = args[2] + ' ' + args[3] + ' ' + endYear;
                var endDate = dateTools.validateDates(message, undefined, rebuilt_end);
            }
        } else {
            var endDate = startDate;
        }
        //Make sure given dates are dates.
        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            //If dates are good, do the update.
            absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start = "${startDate}" AND end = "${endDate}")`);
            //Send message to confirm.
            this.generateResponse(message, "present", "absent", startDate, endDate);
        }
    }

    generateResponse(message, this_command, undo_command, start, end, reason) {
        //Create some helpers and ensure needed parts:
        var friendlyStart = dateTools.makeFriendlyDates(start);
        var friendlyStartUndo = format(new Date(start + offset), 'MMM dd');
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        var friendlyEnd = dateTools.makeFriendlyDates(end);
        var friendlyEndUndo = format(new Date(end + offset), 'MMM dd');
        //Select the appropriate type of response, and shorten if it's a single day.
        if (message.channel.type === 'dm') {
            if (start != end) {
                message.reply(`Ok, I've marked you ${this_command} from ${friendlyStart} until ${friendlyEnd}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo} ${friendlyEndUndo} `);
            } else {
                message.reply(`Ok, I've marked you ${this_command} on ${friendlyStart}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo}`);
            }
        } else {
            if (start != end) {
                message.member.send(`Ok, I've marked you ${this_command} from ${friendlyStart} until ${friendlyEnd}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo} ${friendlyEndUndo} `);
            } else {
                message.member.send(`Ok, I've marked you ${this_command} on ${friendlyStart}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo}`);
            }
        }
        //Handle channel posts for absences and lates. Shorten if only a single day.
        if (this_command === 'absent') {
            if (start != end) {
                client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`)
            } else {
                client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be absent on ${friendlyStart}. They commented: ${reason}`)
            }
        }
        if (this_command === 'late') {
            client.channels.cache.get(`${process.env.attendance_channel}`).send(`${message.author.username} will be late on ${friendlyStart}. They commented: ${reason}`)
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
                    value: "\t\tStart Date: " + dateTools.makeFriendlyDates(row.start) + "\nEnd Date: " + dateTools.makeFriendlyDates(row.end) + "\nComments: " + row.comment,
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
                    value: "\t\tDate: " + dateTools.makeFriendlyDates(row.start) + "\nComments: " + row.comment,
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