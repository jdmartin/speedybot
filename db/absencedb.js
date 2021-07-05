const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
var parseISO = require('date-fns/parseISO');
var isValid = require('date-fns/isValid');
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
            absencedb.run("CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start` TEXT, `end` TEXT)");
            absencedb.run("CREATE TABLE IF NOT EXISTS `latecomers` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start` TEXT, `comment` TEXT)");
        });
    }
}

class DatabaseTools {
    addAbsence(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        let endDate = args[1];
        if (!args[1]) {
            endDate = startDate;
        }
        //Make sure given dates are dates.
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
        }

        if (!isValid(parseISO(endDate))) {
            message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
        }
        //Only update db if we have valid start and end dates.
        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            absencedb.run(`INSERT INTO absences(name, start, end) VALUES ("${message.author.username}", "${startDate}", "${endDate}")`);
        }
        //Send message to confirm.
        if (message.channel.type === 'dm') {
            if (startDate != endDate) {
                message.reply(`Ok, I've marked you absent from ${startDate} until ${endDate}.  \n\nTo undo this, type: !present ${startDate} ${endDate} `);
            } else {
                message.reply(`Ok, I've marked you absent on ${startDate}.  \n\nTo undo this, type: !present ${startDate}`);
            }
        } else {
            if (!startDate != endDate) {
                message.member.send(`Ok, I've marked you absent from ${startDate} until ${endDate}.  \n\nTo undo this, type: !present ${startDate} ${endDate} `);
            } else {
                message.member.send(`Ok, I've marked you absent on ${startDate}.  \n\nTo undo this, type: !present ${startDate}`);
            }
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
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
        }

        if (!isValid(parseISO(endDate))) {
            message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
        }
        //Only update db if we have valid start and end dates.
        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start = "${startDate}" AND end = "${endDate}")`);
        }
        //Send message to confirm.
        if (message.channel.type === 'dm') {
            if (startDate != endDate) {
                message.reply(`Ok, I've marked you present from ${startDate} until ${endDate}.  \n\nTo undo this, type: !absent ${startDate} ${endDate} `);
            } else {
                message.reply(`Ok, I've marked you present on ${startDate}.  \n\nTo undo this, type: !absent ${startDate}`);
            }
        } else {
            if (!startDate != endDate) {
                message.member.send(`Ok, I've marked you present from ${startDate} until ${endDate}.  \n\nTo undo this, type: !absent ${startDate} ${endDate} `);
            } else {
                message.member.send(`Ok, I've marked you present on ${startDate}.  \n\nTo undo this, type: !absent ${startDate}`);
            }
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
                    value: "\t\tStart Date " + row.start + "\nEnd Date " + row.end,
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

        //Make sure given dates are dates.
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a date in the format YYYY-MM-DD.");
        }
        if (isValid(parseISO(startDate))) {
            message.author.send("Ok, I've got the date. If you'd like to add a comment, reply to me in the next five minutes.");
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 300000 });
            collector.on('collect', m => {
                if (m.content) {
                    var safe_reason = SqlString.escape(m.content);
                    absencedb.run(`INSERT INTO latecomers(name, start, comment) VALUES ("${message.author.username}", "${startDate}", "${safe_reason}")`);
                    collector.stop();
                }
            })
        }
    }
}

module.exports = {
    CreateDatabase,
    DatabaseTools,
};