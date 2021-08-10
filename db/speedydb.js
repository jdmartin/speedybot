const Discord = require("discord.js");
const sqlite3 = require('better-sqlite3');
const statsdb = new sqlite3(':memory:');
const utils = require('../utils/speedyutils.js');

const commandFiles = utils.commandFiles;

class CreateDatabase {
    startup() {
        var bootup = statsdb.prepare("CREATE TABLE `commands` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `count` INT, `errors` INT)");
        bootup.run();

        var stmt = statsdb.prepare("INSERT INTO `commands` (`name`, `count`, `errors`) VALUES (?, 0, 0)");
        commandFiles.forEach(name => {
            var thisCommand = name.split(".", 1);
            stmt.run(thisCommand);
        })
    }
}

class DatabaseTools {
    success(command) {
        var successCommand = statsdb.prepare('UPDATE commands SET count = count + 1 WHERE name = (?)');
        successCommand.run(command);
    }

    error(command) {
        var errorCommand = statsdb.prepare('UPDATE commands SET errors = errors + 1 WHERE name = (?)');
        errorCommand.run(command);
    }
}

class GetStats {
    retrieve(message) {
        var sql = statsdb.prepare(`SELECT DISTINCT Name name, Count count, Errors errors FROM commands ORDER BY name`);
        var allStats = sql.all();
        const embed = new Discord.MessageEmbed()
            .setColor(0xFFFFFF)
            .setTitle("Usage stats since last launch")
            .setFooter("These statistics are a product of the Inifite Speedyflight. Use Wisely.")
        allStats.forEach((row) => {
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
    }
}


module.exports = {
    CreateDatabase,
    DatabaseTools,
    GetStats
};