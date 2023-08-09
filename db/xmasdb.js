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
            "CREATE TABLE IF NOT EXISTS `elves` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `count` INTEGER, `notes` TEXT, `address` TEXT, year INTEGER)",
        );

        xmasDBPrep.run();
    }
}

class XmasTools {
    //Commands sanitize the input and add it to the DB.

    addElf(name, count, notes, address) {
        const selectElf = xmasdb.prepare("SELECT COUNT(*) AS count FROM elves WHERE name = ? AND year = ? LIMIT 1");
        var elfSelection = selectElf.pluck().get(name, currentYear);

        if (elfSelection > 0) {
            this.updateElfInDB(parseInt(count), name, SqlString.escape(notes), SqlString.escape(address));
        } else {
            this.addElfToDB(parseInt(count), name, SqlString.escape(notes), SqlString.escape(address));
        }
    }

    addElfToDB(count, name, notes, address) {
        const elfInsert = xmasdb.prepare("INSERT INTO elves(name, count, notes, address, year) VALUES (?,?,?,?,?)");
        elfInsert.run(name, count, notes, address, currentYear);
    }

    updateElfInDB(count, name, notes, address) {
        const elfUpdate = xmasdb.prepare("UPDATE elves SET count = ?, notes = ? , address = ? WHERE name = ? AND year = ?");
        elfUpdate.run(count, notes, address, name, currentYear);
    }
}

class XmasDisplayTools {
    show() {
        const elvesEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Good Little Elves 🧝").setFooter({
            text: "These good elves are known to the Infinite Speedyflight. Use this information wisely.",
        });
        var elfSql = xmasdb.prepare("SELECT * FROM elves WHERE year = ? ORDER BY name ASC");
        var elfResults = elfSql.all(currentYear);
        if (elfResults.length > 0) {
            elfResults.forEach((row) => {
                elvesEmbed.addFields({
                    name: row.name,
                    value: "Number of Cards: " + row.count + "\nNotes: " + row.notes + "\nAddress: " + row.address.replace(/\\n/g, ', '),
                    inline: false,
                });
            });
        } else {
            elvesEmbed.addFields({
                name: "No one of consequence!",
                value: "No elves, yet!  Looks like everyone's getting coal...",
                inline: false,
            });
        }

        return elvesEmbed;
    }

    stats() {
        const elfStatsEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Happy Little Stats 🧝");

        var cardTotal = xmasdb.prepare("SELECT SUM(count) FROM elves WHERE year = ?");
        var cardTotalResults = cardTotal.pluck().get(currentYear);

        var allTimeCardTotal = xmasdb.prepare("SELECT SUM(count) FROM elves");
        var allTimeCardTotalResults = allTimeCardTotal.pluck().get();

        if (cardTotalResults > 0) {
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
        } else {
            elfStatsEmbed.addFields({
                name: "Saddest Number of Cards:",
                value: "0",
                inline: false,
            });
        }

        return elfStatsEmbed;
    }
}

module.exports = {
    XmasTools,
    CreateXmasDatabase,
    XmasDisplayTools,
};
