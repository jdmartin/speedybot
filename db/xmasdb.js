require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const sqlite3 = require("better-sqlite3");
const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

//Other Tools
var SqlString = require("sqlstring");

let xmasdb = new sqlite3("./db/xmas.db");

class CreateXmasDatabase {
    startup() {
        var xmasDBPrep = xmasdb.prepare(
            "CREATE TABLE IF NOT EXISTS `elves` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `count` INTEGER, `notes` TEXT, year INTEGER)",
        );

        xmasDBPrep.run();
    }
}

class XmasTools {
    //Commands sanitize the input and add it to the DB.

    addElf(name, count, notes) {
        const selectElf = xmasdb.prepare("SELECT COUNT(*) AS count FROM elves WHERE name = ? AND year = ? LIMIT 1");
        var elfSelection = selectElf.pluck().get(name, currentYear);

        if (elfSelection > 0) {
            this.updateElfInDB(parseInt(count), name, SqlString.escape(notes));
        } else {
            this.addElfToDB(parseInt(count), name, SqlString.escape(notes));
        }
    }

    addElfToDB(count, name, notes) {
        const elfInsert = xmasdb.prepare("INSERT INTO elves(name, count, notes, year) VALUES (?,?,?,?)");
        elfInsert.run(name, count, notes, currentYear);
    }

    updateElfInDB(count, name, notes) {
        const elfUpdate = xmasdb.prepare("UPDATE elves SET count = ?, notes = ? WHERE name = ? AND year = ?");
        elfUpdate.run(count, notes, name, currentYear);
    }
}

class XmasDisplayTools {
    show() {
        const elvesEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Good Little Elves 🧝").setFooter({
            text: "These good elves are known to the Infinite Speedyflight. Use this information wisely.",
        });

        var elfSql = xmasdb.prepare("SELECT * FROM elves WHERE year = ? ORDER BY name ASC");
        var elfResults = elfSql.all(currentYear);

        elfResults.forEach((row) => {
            elvesEmbed.addFields({
                name: row.name,
                value: "Number of Cards: " + row.count + "\nNotes: " + row.notes,
                inline: false,
            });
        });

        return elvesEmbed;
    }

    stats() {
        const elfStatsEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Happy Little Stats 🧝");

        var cardTotal = xmasdb.prepare("SELECT SUM(count) FROM elves WHERE year = ?");
        var cardTotalResults = cardTotal.pluck().get(currentYear);

        var allTimeCardTotal = xmasdb.prepare("SELECT SUM(count) FROM elves");
        var allTimeCardTotalResults = allTimeCardTotal.pluck().get();

        elfStatsEmbed.addFields({
            name: `Total Cards for ${currentYear.toString()}`,
            value: cardTotalResults.toString(),
            inline: false,
        });

        elfStatsEmbed.addFields({
            name: "All-Time Card Total",
            value: allTimeCardTotalResults.toString(),
            inline: false,
        });

        return elfStatsEmbed;
    }
}

module.exports = {
    XmasTools,
    CreateXmasDatabase,
    XmasDisplayTools,
};
