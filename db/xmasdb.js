require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const sqlite3 = require("better-sqlite3");
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

//Other Tools
var SqlString = require("sqlstring");

let xmasdb = new sqlite3("./db/xmas.db");

class CreateXmasDatabase {
    startup() {
        var xmasDBPrep = xmasdb.prepare(
            "CREATE TABLE IF NOT EXISTS `elves` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `count` TEXT, `notes` TEXT, year INTEGER)",
        );

        xmasDBPrep.run();
    }
}

class XmasTools {
    //Commands sanitize the input and add it to the DB.

    addElf(name, count, notes) {
        this.addElfToDB(SqlString.escape(count), SqlString.escape(name), SqlString.escape(notes));
    }

    addElfToDB(count, name, notes) {
        var elfPrep = xmasdb.prepare("INSERT INTO elves(name, count, notes, year) VALUES (?,?,?,?)");
        elfPrep.run(name, count, notes, currentYear);
    }
}

class XmasDisplayTools {
    show() {
        const elvesEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Good Little Elves 🧝").setFooter({
            text: "These good elves are known to the Infinite Speedyflight. Use this information wisely.",
        });

        var elfSql = xmasdb.prepare("SELECT * FROM elves WHERE year = ?");
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
}

module.exports = {
    XmasTools,
    CreateXmasDatabase,
    XmasDisplayTools,
};
