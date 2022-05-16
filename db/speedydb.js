const {
    MessageEmbed
} = require("discord.js");
const sqlite3 = require('better-sqlite3');
const statsdb = new sqlite3(':memory:');
const utils = require('../utils/speedyutils.js');
const commandFiles = utils.commandFiles;
const slashCommandFiles = utils.slashCommandFiles;

class CreateDatabase {
    startup() {
        var bootup = statsdb.prepare("CREATE TABLE `commands` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `count` INT, `errors` INT)");
        bootup.run();

        var slash_bootup = statsdb.prepare("CREATE TABLE `slash_commands` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `count` INT, `errors` INT)");
        slash_bootup.run();

        var stmt = statsdb.prepare("INSERT INTO `commands` (`name`, `count`, `errors`) VALUES (?, 0, 0)");
        commandFiles.forEach(name => {
            var thisCommand = name.split(".", 1);
            stmt.run(thisCommand);
        })

        var slash_stmt = statsdb.prepare("INSERT INTO `slash_commands` (`name`, `count`, `errors`) VALUES (?, 0, 0)");
        slashCommandFiles.forEach(name => {
            var thisSlashCommand = name.split(".", 1);
            slash_stmt.run(thisSlashCommand);
        })
    }
}

class DatabaseTools {
    success(command) {
        var successCommand = statsdb.prepare('UPDATE commands SET count = count + 1 WHERE name = (?)');
        successCommand.run(command);
    }

    slash_success(command) {
        var successCommand = statsdb.prepare('UPDATE slash_commands SET count = count + 1 WHERE name = (?)');
        successCommand.run(command);
    }

    error(command) {
        var errorCommand = statsdb.prepare('UPDATE commands SET errors = errors + 1 WHERE name = (?)');
        errorCommand.run(command);
    }

    slash_error(command) {
        var errorCommand = statsdb.prepare('UPDATE slash_commands SET errors = errors + 1 WHERE name = (?)');
        errorCommand.run(command);
    }
}

class GetStats {

    retrieve(message) {
        var sql = statsdb.prepare('SELECT DISTINCT Name name, Count count, Errors errors FROM commands ORDER BY name');
        var allStats = sql.all();
        var slash_sql = statsdb.prepare('SELECT DISTINCT Name name, Count count, Errors errors FROM slash_commands ORDER BY name');
        var allSlashStats = slash_sql.all();

        const statsEmbed = new MessageEmbed()
            .setColor(0xFFFFFF)
            .setTitle("Usage stats since last launch")
            .setFooter({
                text: "These statistics are a product of the Inifite Speedyflight. Use Wisely."
            })
        allStats.forEach((row) => {
            statsEmbed.addFields({
                name: row.name,
                value: "\t\tCount: " + row.count + "\t\tErrors " + row.errors,
                inline: true
            })
        });

        const slash_embed = new MessageEmbed()
            .setColor(0xFFFFFF)
            .setTitle("Slash usage stats since last launch")
            .setFooter({
                text: "These statistics are a product of the Inifite Speedyflight. Use Wisely."
            })
        allSlashStats.forEach((row) => {
            slash_embed.addFields({
                name: row.name,
                value: "\t\tCount: " + row.count + "\t\tErrors " + row.errors,
                inline: true
            })
        });

        if (message.channel.type === 'DM') {
            message.channel.send({
                embeds: [statsEmbed, slash_embed]
            });
        } else {
            message.member.send({
                embeds: [statsEmbed, slash_embed]
            });
        }
    }
}


module.exports = {
    CreateDatabase,
    DatabaseTools,
    GetStats,
};