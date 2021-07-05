const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
var parseISO = require('date-fns/parseISO');
var isValid = require('date-fns/isValid');

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
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
        }

        if (!isValid(parseISO(endDate))) {
            message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
        }

        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            absencedb.run(`INSERT INTO absences(name, start, end) VALUES ("${message.author.username}", "${startDate}", "${endDate}")`);
        }
        if (message.channel.type === 'dm') {
            message.reply(`Ok, I've marked you absent from ${startDate} until${endDate}.  To undo this, type:\n\n !present ${startDate} ${endDate} `);
        } else {
            message.member.send(`Ok, I've marked you absent from ${startDate} until${endDate}.  To undo this, type:\n\n !present ${startDate} ${endDate} `);
        }
    }

    addPresent(message, args) {
        //Make sure we have start and end dates.
        let startDate = args[0];
        let endDate = args[1];
        if (!args[1]) {
            endDate = startDate;
        }
        if (!isValid(parseISO(startDate))) {
            message.reply("Sorry, I need a start date in the format YYYY-MM-DD.");
        }

        if (!isValid(parseISO(endDate))) {
            message.reply("Sorry, I need an end date in the format YYYY-MM-DD. If none is given, I'll assume it's the same as the start date.");
        }

        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            absencedb.run(`DELETE FROM absences WHERE (name = "${message.author.username}" AND start = "${startDate}" AND end = "${endDate}")`);
        }
    }

    show(message) {
        let sql = `SELECT * FROM absences WHERE start >= date('now','-1 day') ORDER BY name`;

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
}

module.exports = {
    CreateDatabase,
    DatabaseTools,
};