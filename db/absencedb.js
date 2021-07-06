require("dotenv").config();
const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const utils = require("../utils/speedyutils.js");
const client = utils.client;
var parseISO = require('date-fns/parseISO');
var parse = require('date-fns/parse');
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
        //Get Date in GMT - 5
        let today = new Date(new Date()-3600*1000*5);
        let simple_today = today.toISOString().split('T')[0];
        let tuesday = nextTuesday(parseISO(simple_today)).toISOString().split('T')[0];
        let thursday = nextThursday(parseISO(simple_today)).toISOString().split('T')[0];
        let sunday = nextSunday(parseISO(simple_today)).toISOString().split('T')[0];
        let lower_selection = day.toLowerCase();

        switch(lower_selection) {
            case 'today':
                return(simple_today);
            case 'tue':
                return(tuesday);
            case 'tuesday':
                return(tuesday);
            case 'thu':
                return(thursday);
            case 'thursday':
                return(thursday);
            case 'sun':
                return(sunday);
            case 'sunday':
                return(sunday);
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
        
        if (start != undefined) {
            if (days.includes(start.toLowerCase())) {
                var new_start = this.calculateDate(start);
                return (new_start);
            } else {
                //Make sure given dates are dates.
                if ((isValid(parseISO(start)))) {
                    return (start);
                }
                if ((isValid(parse(start, 'LLL dd, yyyy', new Date())))) {
                    console.log(parse(start, 'LLL dd, yyyy', new Date()));
                }
                if (!isValid(parseISO(start))) {
                    message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
                    return;
                }
            }
        }

        if (end != undefined) {
            //Handle special days
            if (days.includes(end.toLowerCase())) {
                var new_end = this.calculateDate(end);
                return (new_end);
            } else {
                //Make sure given dates are dates.
                if ((isValid(parseISO(end)))) {
                    return (end);
                }
                if (!isValid(parseISO(end))) {
                    message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
                }
            }
        }
    }
}


const tools = new DataFormattingTools();

class DataEntryTools {
    addAbsence(message, args) {
        //Make sure we have start and end dates.
        let startDate = tools.validateDates(message, args[0], undefined);
        //Handle special days
        const days = ['today', 'tue', 'tuesday', 'thu', 'thursday', 'sun', 'sunday'];
        if (args[1] != undefined) {
            if (days.includes(args[1].toLowerCase())) {
                var endDate = tools.validateDates(message, undefined, args[1]);
                //Process Comments
                var comment = args.slice(2).join(' ');
            } else if (!isValid(parseISO(args[1]))) {
                var endDate = startDate;
                //Process Comments
                var comment = args.slice(1).join(' ');
            } 
        } 
        //Make sure there's something in the comment field, even if empty.
        if (comment) {
            var safe_reason = SqlString.escape(comment);
        } else {
            var safe_reason = ' ';
        }
        //Make sure dates are good.
        if ((isValid(parseISO(startDate)))) {
            absencedb.run(`INSERT INTO absences(name, start, end, comment) VALUES ("${message.author.username}", "${startDate}", "${endDate}", "${safe_reason}")`);
            tools.generateResponse(message, "absent", "present", startDate, endDate, safe_reason);
        }                
    }

    addPresent(message, args) {
        //Make sure we have start and end dates.
        let startDate = tools.validateDates(message, args[0], undefined);
        if (args[1]) {
            var endDate = tools.validateDates(message, undefined, args[1]);
        }
        if (!args[1]) {
            endDate = startDate;
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
        //Make sure we have dates.
        if (args[0] && args[1] && args[2]) {
            var rebuilt_date = args[0] + ' ' + args[1] + ' ' + args[2];
        }
        let startDate = tools.validateDates(message, rebuilt_date, undefined);
        //Only update db if we have a valid date.
        if (isValid(parseISO(startDate))) {
            absencedb.run(`DELETE FROM latecomers WHERE (name = "${message.author.username}" AND start = "${startDate}")`);
            message.author.send(`Ok, I've got you down as on-time on ${tools.makeFriendlyDates(startDate)}. See you then!`)
        }
    }

    tardy(message, args) {
        //Make sure we have a date.
        let startDate = tools.validateDates(message, args[0], undefined);

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