require("dotenv").config();
const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const utils = require("../utils/speedyutils.js");
const client = utils.client;
var parseISO = require('date-fns/parseISO');
var parse = require('date-fns/parse');
var isValid = require('date-fns/isValid');
var format = require('date-fns/format');
var SqlString = require('sqlstring');
const offset = 'T11:52:29.478Z';

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
    checkIsDate(a, b, c) {
        if (parse(a, 'LLLL', new Date())) {
            if (parse(b, 'dd', new Date())) {
                if ((parse(c, 'yyyy', new Date()))) {
                    return (true);
                }
            }
        } else {
            return (false);
        }
    }

    determineYear(month, day) {
        //Create date object in GMT-5
        var d = new Date(new Date()-3600*1000*5);
        //Set current year, month, and date
        let year = d.getFullYear();
        let mon = d.toLocaleString("en-US", {month: "long"});
        let date = d.getDate();
        
        if ((mon == month) && (date == day)) {
            console.log("Yay!");
        }
        console.log(year, mon, date);
        //If month, day is equal to today: return this year.
        //If month, day is after today: return this year.
        //If month, day is before today: return next year.
    }

    generateResponse(message, this_command, undo_command, start, end, reason) {
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        //Select the appropriate type of response, and shorten if it's a single day.
        if (message.channel.type === 'dm') {
            if (start != end) {
                message.reply(`Ok, I've marked you ${this_command} from ${tools.makeFriendlyDates(start)} until ${tools.makeFriendlyDates(end)}.  \n\nTo undo this, type: !${undo_command} ${format(new Date(start + offset), 'MMM dd yyyy')} ${format(new Date(end + offset), 'MMM dd yyyy')} `);
            } else {
                message.reply(`Ok, I've marked you ${this_command} on ${tools.makeFriendlyDates(start)}.  \n\nTo undo this, type: !${undo_command} ${format(new Date(start + offset), 'MMM dd yyyy')}`);
            }
        } else {
            if (start != end) {
                message.member.send(`Ok, I've marked you ${this_command} from ${tools.makeFriendlyDates(start)} until ${tools.makeFriendlyDates(end)}.  \n\nTo undo this, type: !${undo_command} ${format(new Date(start + offset), 'MMM dd yyyy')} ${format(new Date(end + offset), 'MMM dd yyyy')} `);
            } else {
                message.member.send(`Ok, I've marked you ${this_command} on ${tools.makeFriendlyDates(start)}.  \n\nTo undo this, type: !${undo_command} ${format(new Date(start + offset), 'MMM dd yyyy')}`);
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
        let friendlyDateTemp = date + offset;
        let friendlyDate = format(new Date(friendlyDateTemp), 'iii. MMMM dd, yyyy');
        return (friendlyDate)
    }

    validateDates(message, start, end) {
        if (start != undefined) {
            //Make sure given dates are dates.
            if ((isValid(parse(start, 'LLLL dd, yyyy', new Date())))) {
                let temp_date = parse(start, 'LLLL dd, yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            if ((isValid(parse(start, 'LLLL dd yyyy', new Date())))) {
                let temp_date = parse(start, 'LLLL dd yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            //Request date in proper format.
            message.reply("Sorry, I need a start date in the format 'Month Day, Year'");
            return;
        }
        if (end != undefined) {
            if ((isValid(parse(end, 'LLLL dd, yyyy', new Date())))) {
                let temp_date = parse(end, 'LLLL dd, yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            if ((isValid(parse(end, 'LLLL dd yyyy', new Date())))) {
                let temp_date = parse(end, 'LLLL dd yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            message.reply("Sorry, I need an end date in the format 'Month Day, Year'. If none is given, I'll assume it's the same as the start date.");
            return;
        }
    }
}

const tools = new DataFormattingTools();

class DataEntryTools {
    addAbsence(message, args) {
        //Make sure we have start and end dates.
        if (args.length >= 3) {
            if (tools.checkIsDate(args[0], args[1], args[2])) {
                var rebuilt_start = args[0] + ' ' + args[1] + ' ' + args[2];
                var startDate = tools.validateDates(message, rebuilt_start, undefined);
                //Process Comments
                var comment = args.slice(3).join(' ');
            }
        }
        if (args[3] && args[4] && args[5]) {
            if (tools.checkIsDate(args[3], args[4], args[5])) {
                var rebuilt_end = args[3] + ' ' + args[4] + ' ' + args[5];
                var endDate = tools.validateDates(message, undefined, rebuilt_end);
                //Process Comments
                var comment = args.slice(6).join(' ');
            }
        } else {
            var endDate = startDate;
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
            tools.generateResponse(message, "absent", "present", startDate, endDate, safe_reason);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    addPresent(message, args) {
        //Make sure we have start and end dates.
        if (args.length >= 3) {
            if (tools.checkIsDate(args)) {
                var rebuilt_start = args[0] + ' ' + args[1] + ' ' + args[2];
                var startDate = tools.validateDates(message, rebuilt_start, undefined);
                if (args[3] && args[4] && args[5]) {
                    var rebuilt_end = args[3] + ' ' + args[4] + ' ' + args[5];
                    var endDate = tools.validateDates(message, undefined, rebuilt_end);
                } else {
                    var endDate = startDate;
                }
            }
        }
        //Make sure given dates are dates.
        if ((isValid(parseISO(startDate))) && (isValid(parseISO(endDate)))) {
            //If dates are good, do the update.
            absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start = "${startDate}" AND end = "${endDate}")`);
            //Send message to confirm.
            tools.generateResponse(message, "present", "absent", startDate, endDate);
        }
    }

    ontime(message, args) {
        //tools.determineYear(args[0],args[1]);
        //Make sure we have dates.
        if (args.length == 3) {
            if (tools.checkIsDate(args)) {
                var rebuilt_date = args[0] + ' ' + args[1] + ' ' + args[2];
                var startDate = tools.validateDates(message, rebuilt_date, undefined);
            }
        }
        //Only update db if we have a valid date.
        if (isValid(parseISO(startDate))) {
            absencedb.run(`DELETE FROM latecomers WHERE (name = "${message.author.username}" AND start = "${startDate}")`);
            message.author.send(`Ok, I've got you down as on-time on ${tools.makeFriendlyDates(startDate)}. See you then!`)
        }
    }

    tardy(message, args) {
        //Make sure we have a date.
        if (args.length >= 3) {
            if (tools.checkIsDate(args)) {
                var rebuilt_date = args[0] + ' ' + args[1] + ' ' + args[2];
                var startDate = tools.validateDates(message, rebuilt_date, undefined);
                //Process a comment, if supplied.
                var comment = args.slice(3).join(' ');
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