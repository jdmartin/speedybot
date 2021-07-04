const Discord = require("discord.js");
const sqlite3 = require('sqlite3');

let absencedb = new sqlite3.Database('./db/absence.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the absence database.');
  });

 class CreateDatabase {
     startup() {
         absencedb.serialize(function () {
             absencedb.run("CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start` TEXT, `end` TEXT, `comment` TEXT)")
         });
     }
 }

class DatabaseTools {
    test(message, args) {
        absencedb.run(`INSERT INTO absences(name, start, end, comment) VALUES ("${message.author.username}", "${args[0]}", "${args[1]}", "${args[2]}")`);
    }

    show(message) {
        let sql = `SELECT * FROM absences ORDER BY name`;

        absencedb.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            const embed = new Discord.MessageEmbed()
                .setColor(0xFFFFFF)
                .setTitle("Upcoming absences")
                .setFooter("These absences are a product of the Inifite Speedyflight. Use Wisely.")
            rows.forEach((row) => {
                embed.addFields({
                    name: row.name,
                    value: "\t\tStart Date " + row.start + "\nEnd Date " + row.end + "\nComment " + row.comment,
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