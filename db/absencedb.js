require("dotenv").config();
const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const utils = require("../utils/speedyutils.js");
const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();
const client = utils.client;
//Date-related
const offset = 'T11:52:29.478Z';
var eachDayOfInterval = require('date-fns/eachDayOfInterval')
var format = require('date-fns/format');
var isTuesday = require('date-fns/isTuesday')
var isThursday = require('date-fns/isThursday')
var isSunday = require('date-fns/isSunday');
var isValid = require('date-fns/isValid');
var parseISO = require('date-fns/parseISO');
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
            absencedb.run("CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `end_date`, `comment` TEXT)");
            absencedb.run("CREATE TABLE IF NOT EXISTS `latecomers` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `start_date`, `comment` TEXT)");
        });
    }
}

class AttendanceTools {
    //Commands absent, late, ontime, and present for scheduling.

    absent(message, args) {
        //Make sure we have start and end dates.
        if (dateTools.checkIsMonth(args[0])) {
            var startYear = dateTools.determineYear(args[0], args[1]);
            if (dateTools.checkIsDate(args[0], args[1], startYear)) {
                var startDay = args[1];
                var combinedStartDate = args[0] + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedStartDate, undefined);
            }
            //Process Comments
            var comment = args.slice(2).join(' ');
        }
        if (dateTools.checkIsMonth(args[2])) {
            //Make sure end year is equal or greater to start year.
            ///HMM
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(args[2], args[3]);
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(args[2], args[3], endYear)) {
                var endDay = args[3];
                var combinedEndDate = args[2] + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
                //Process Comments
                var comment = args.slice(4).join(' ');
            }
        } else {
            var endDate = startDate;
            var comment = args.slice(2).join(' ');
        }

        //Make sure dates are good.
        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            //If we have a range of days, let's store them individually... 
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            this.processDBUpdate(message, "absent", startDate, endDate, comment);
            this.generateResponse(message, "absent", "present", startDate, endDate, comment);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    late(message, args) {
        var startYear = dateTools.determineYear(args[0], args[1]);
        //Make sure we have a date.
        if (dateTools.checkIsMonth(args[0])) {
            if (dateTools.checkIsDate(args)) {
                var startDay = args[1];
                let combinedDate = args[0] + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedDate, undefined);
                //Process a comment, if supplied.
                var comment = args.slice(2).join(' ');
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
                var endDay = args[3];
                var combinedEndDate = args[2] + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
                //Process Comments
                var comment = args.slice(4).join(' ');
            }
        } else {
            var endDate = startDate;
            var comment = args.slice(2).join(' ');
        }

        //Only update db if we have a valid date.
        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            //If we have a range of days, let's store them individually... 
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            this.processDBUpdate(message, "late", startDate, endDate, comment);
            this.generateResponse(message, "late", "ontime", startDate, endDate, comment);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    ontime(message, args) {
        //Make sure we have a date.
        var startYear = dateTools.determineYear(args[0], args[1]);
        if (dateTools.checkIsMonth(args[0])) {
            if (dateTools.checkIsDate(args)) {
                var startDay = args[1];
                let combinedDate = args[0] + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedDate, undefined);
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
                var endDay = args[3];
                var combinedEndDate = args[2] + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
            }
        } else {
            var endDate = startDate;
        }
        //Only update db if we have a valid date.
        if (isValid(parseISO(startDate))) {
            this.processDBUpdate(message, "ontime", startDate, endDate, undefined);
            if (startDate != endDate) {
                message.author.send(`Ok, I've got you down as on-time from ${dateTools.makeFriendlyDates(startDate)} until ${dateTools.makeFriendlyDates(endDate)}. See you then!`);
            } else {
                message.author.send(`Ok, I've got you down as on-time on ${dateTools.makeFriendlyDates(startDate)}. See you then!`);
            }
        }
    }

    present(message, args) {
        //Make sure we have start and end dates.
        var startYear = dateTools.determineYear(args[0], args[1]);
        if (dateTools.checkIsMonth(args[0])) {
            if (dateTools.checkIsDate(args[0], args[1], startYear)) {
                var startDay = args[1];
                var combinedStartDate = args[0] + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedStartDate, undefined);
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
                var endDay = args[3];
                var combinedEndDate = args[2] + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
            }
        } else {
            var endDate = startDate;
        }
        //Make sure dates are good.
        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            //If we have a range of days, let's store them individually... 
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            this.processDBUpdate(message, "present", startDate, endDate, undefined);
            this.generateResponse(message, "present", "absent", startDate, endDate, undefined);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    //command addAbsence, addLate, addOntime, and addPresent, processDBUpdate, for updating the db.
    addAbsence(message, sy, sm, sd, end, comment) {
        absencedb.run(`INSERT INTO absences(name, start_year, start_month, start_day, end_date, comment) VALUES ("${message.author.username}", "${sy}", "${sm}", "${sd}", "${end}", ?)`, SqlString.escape(comment));
    }

    addPresent(message, sm, sd) {
        absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start_month = "${sm}" AND start_day = "${sd}")`);
    }

    addLate(message, sy, sm, sd, start, comment) {
        absencedb.run(`INSERT INTO latecomers(name, start_year, start_month, start_day, start_date, comment) VALUES ("${message.author.username}", "${sy}", "${sm}", "${sd}", "${start}", ?)`, SqlString.escape(comment));
    }

    addOntime(message, sm, sd) {
        absencedb.run(`DELETE FROM latecomers WHERE (name = "${message.author.username}" AND start_month = "${sm}" AND start_day = "${sd}")`);
    }

    processDBUpdate(message, kind, startDate, endDate, comment) {
        //Make sure there's a comment:
        if (comment == undefined) {
            comment = '';
        }

        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            //If we have a range of days, let's store them individually... 
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            //Setup some useful variables.
            let startDay = startDate.split('-')[2];
            let startMonth = startDate.split('-')[1];
            let endDay = endDate.split('-')[2];
            let endMonth = endDate.split('-')[1];
            //If no range of dates:
            if ((endDay == startDay) && (endMonth == startMonth)) {
                if (isTuesday(parseISO(startDate)) || isThursday(parseISO(startDate)) || isSunday(parseISO(startDate))) {
                    let newYear = startDate.split('-')[0];
                    let newMonth = startDate.split('-')[1];
                    let newDay = startDate.split('-')[2];
                    let newDate = newYear + "-" + newMonth + "-" + newDay;
                    if (kind === 'absent') {
                        this.addAbsence(message, newYear, newMonth, newDay, newDate, comment);
                    }
                    if (kind === 'present') {
                        this.addPresent(message, newMonth, newDay);
                    }
                    if (kind === 'late') {
                        this.addLate(message, newYear, newMonth, newDay, newDate, comment);
                    }
                    if (kind === 'ontime') {
                        this.addOntime(message, newMonth, newDay);
                    }
                }
            }
            //Do we have a range of dates?
            if (endDay > startDay || endMonth != startMonth) {
                const result = eachDayOfInterval({
                    start: new Date(parseISO(startDate)),
                    end: new Date(parseISO(endDate))
                });
                for (let i = 0; i < result.length; i++) {
                    let short_item = result[i].toISOString().split('T')[0];
                    if (isTuesday(parseISO(short_item)) || isThursday(parseISO(short_item)) || isSunday(parseISO(short_item))) {
                        let newYear = short_item.split('-')[0];
                        let newMonth = short_item.split('-')[1];
                        let newDay = short_item.split('-')[2];
                        let newDate = newYear + "-" + newMonth + "-" + newDay;
                        if (kind === 'absent') {
                            this.addAbsence(message, newYear, newMonth, newDay, newDate, comment);
                        }
                        if (kind === 'present') {
                            this.addPresent(message, newMonth, newDay);
                        }
                        if (kind === 'late') {
                            this.addLate(message, newYear, newMonth, newDay, newDate, comment);
                        }
                        if (kind === 'ontime') {
                            this.addOntime(message, newMonth, newDay);
                        }
                    }
                }
            }
        }
    }

    //command generateResponse for notifying the user of what has been done.
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
        let sql = `SELECT * FROM absences WHERE end_date >= date('now','-1 day') ORDER BY end_date ASC, name;`;

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
                    value: "\t\tDate: " + dateTools.makeFriendlyDates(row.end_date) + "\nComments: " + row.comment,
                    inline: false
                })
            });
            message.reply(embed);
        });
        //Get all tardiness from today and later.
        let late_sql = `SELECT * FROM latecomers WHERE start_date >= date('now','-1 day') ORDER BY name`;

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
                    value: "\t\tDate: " + dateTools.makeFriendlyDates(row.start_date) + "\nComments: " + row.comment,
                    inline: false
                })
            });
            message.reply(embed);
        });
    }
}

module.exports = {
    AttendanceTools,
    CreateDatabase,
    DataDisplayTools,
};