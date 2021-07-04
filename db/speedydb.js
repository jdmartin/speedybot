const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
const statsdb = new sqlite3.Database(':memory:');
const utils = require('../utils/speedyutils.js');

const commandFiles = utils.commandFiles;

class CreateDatabase {
    startup() {
        statsdb.serialize(function () {
            statsdb.run("CREATE TABLE `commands` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `count` INT, `errors` INT)");

            var stmt = statsdb.prepare("INSERT INTO `commands` (`name`, `count`, `errors`) VALUES (?, 0, 0)");
            commandFiles.forEach(name => {
                var thisCommand = name.split(".", 1);
                stmt.run(thisCommand);
            })
            stmt.finalize();
        });
    }
}

class DatabaseTools {
    success(command) {
        statsdb.run('UPDATE commands SET count = count + 1 WHERE name = (?)', [command]);
    }

    error(command) {
        statsdb.run('UPDATE commands SET errors = errors + 1 WHERE name = (?)', [command]);
    }
}

class GetStats {
    retrieve(message) {
        let sql = `SELECT DISTINCT Name name, Count count, Errors errors FROM commands ORDER BY name`;

        statsdb.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            const embed = new Discord.MessageEmbed()
                .setColor(0xFFFFFF)
                .setTitle("Usage stats since last launch")
                .setFooter("These statistics are a product of the Inifite Speedyflight. Use Wisely.")
            rows.forEach((row) => {
                embed.addFields({
                    name: row.name,
                    value: "\t\tCount: " + row.count + "\t\tErrors " + row.errors,
                    inline: true
                })
            });
            if (message.channel.type === 'dm') {
                message.channel.send(embed);
            } else {
                message.member.send(embed);
            }
        })
    }
}

module.exports = {
    CreateDatabase,
    DatabaseTools,
    GetStats
};