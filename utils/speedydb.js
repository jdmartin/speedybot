const {
    ChannelType, EmbedBuilder
} = require("discord.js");
const sqlite3 = require('better-sqlite3');
const statsdb = new sqlite3(':memory:');
const utils = require('./speedyutils.js');
const slashCommandFiles = utils.slashCommandFiles;

class CreateDatabase {
    startup() {
        var slash_bootup = statsdb.prepare("CREATE TABLE `slash_commands` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `count` INT, `errors` INT)");
        slash_bootup.run();

        var slash_stmt = statsdb.prepare("INSERT INTO `slash_commands` (`name`, `count`, `errors`) VALUES (?, 0, 0)");
        slashCommandFiles.forEach(name => {
            var thisSlashCommand = name.split(".", 1);
            slash_stmt.run(thisSlashCommand);
        })
    }
}

class DatabaseTools {
    slash_success(command) {
        var successCommand = statsdb.prepare('UPDATE slash_commands SET count = count + 1 WHERE name = (?)');
        successCommand.run(command);
    }

    slash_error(command) {
        var errorCommand = statsdb.prepare('UPDATE slash_commands SET errors = errors + 1 WHERE name = (?)');
        errorCommand.run(command);
    }
}

class GetStats {
    retrieve() {
        var slash_sql = statsdb.prepare('SELECT DISTINCT Name name, Count count, Errors errors FROM slash_commands ORDER BY name');
        var allSlashStats = slash_sql.all();

        const slashEmbed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle("Slash usage stats since last launch")
            .setFooter({
                text: "These statistics are a product of the Inifite Speedyflight. Use Wisely."
            });

        allSlashStats.forEach((row) => {
            slashEmbed.addFields({
                name: row.name,
                value: "\t\tCount: " + row.count + "\t\tErrors " + row.errors,
                inline: true
            })
        });

        return { slashEmbed }
    }
}


module.exports = {
    CreateDatabase,
    DatabaseTools,
    GetStats,
};