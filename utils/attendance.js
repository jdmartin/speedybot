const { EmbedBuilder } = require("discord.js");
const sqlite3 = require("better-sqlite3");
const utils = require("./speedyutils.js");
const dates = require("./datetools.js");
const dateTools = new dates.dateTools();
const client = utils.client;
//Date-related
const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const isTuesday = require("date-fns/isTuesday");
const isThursday = require("date-fns/isThursday");
const isSunday = require("date-fns/isSunday");
const parseISO = require("date-fns/parseISO");

//DB
class CreateDatabase {
    constructor() {
        this.absencedb = new sqlite3("./db/attendance.db");
    }
    startup() {
        var absenceDBPrep = this.absencedb.prepare(
            "CREATE TABLE IF NOT EXISTS `attendance` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `discord_name` TEXT NOT NULL, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `end_date` TEXT, `comment` TEXT, `kind` TEXT NOT NULL)",
        );
        var messagesDBPrep = this.absencedb.prepare(
            "CREATE TABLE IF NOT EXISTS `messages` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `discord_name` TEXT, `start_date` TEXT, `end_date` TEXT, `messageID` TEXT)",
        );
        absenceDBPrep.run();
        messagesDBPrep.run();
    }
}

class attendanceTools {
    constructor() {
        this.absencedb = new sqlite3("./db/attendance.db");
        this.Responses = [];
        this.counter = 0;
        this.chosenAction = "";
        this.bypassList = ["ontime", "present"];
        this.restriction = "";
    }

    addAbsence(name, nickname, sy, sm, sd, end, comment, kind) {
        var absencePrep = this.absencedb.prepare(
            "INSERT INTO attendance(name, discord_name, start_year, start_month, start_day, end_date, comment, kind) VALUES (?,?,?,?,?,?,?,?)",
        );
        absencePrep.run(nickname, name, sy, sm, sd, end, comment, kind);
    }

    cancelAbsence(name, date) {
        var cancelPrep = this.absencedb.prepare(
            "DELETE FROM attendance WHERE (discord_name = ? AND end_date = ?)",
        );
        cancelPrep.run(name, date);
    }

    processDBUpdate(name, nickname, kind, comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day) {
        const result = eachDayOfInterval({
            start: new Date(start_year, start_month, start_day),
            end: new Date(end_year, end_month, end_day),
        });
        this.processDBUpdateFilterLoop(result, kind, name, nickname, comment, restriction);
    }

    // prettier-ignore
    processDBUpdateFilterLoop(result, kind, name, nickname, comment, restriction, end_date) {
        for (let i = 0; i < result.length; i++) {
            let short_item = result[i].toISOString().split("T")[0];
            let newYear = short_item.split("-")[0];
            let newMonth = short_item.split("-")[1];
            let newDay = short_item.split("-")[2];
            let newDate = newYear + "-" + newMonth + "-" + newDay;
            this.filterDBUpdate(restriction, name, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind);
        }
    }

    // prettier-ignore
    filterDBUpdate(restriction, name, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind) {
        if (restriction === "none") {
            if (isTuesday(parseISO(short_item)) || isThursday(parseISO(short_item)) || isSunday(parseISO(short_item))) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        } else if (restriction === "t") {
            if (isTuesday(parseISO(short_item))) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        } else if (restriction === "r") {
            if (isThursday(parseISO(short_item))) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        } else if (restriction === "s") {
            if (isSunday(parseISO(short_item))) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        }
    }

    doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind) {
        if (kind === "absent" || kind === "late") {
            this.addAbsence(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
        }
        if (kind === "cancel") {
            this.cancelAbsence(name, newDate);
        }
    }

    //command generateResponse for notifying the user of what has been done.
    generateResponse(name, nickname, this_command, start, end, reason, restriction) {
        //Create some helpers and ensure needed parts:
        var friendlyStart = dateTools.makeFriendlyDates(start);
        var namestring = "";
        if (nickname != name) {
            namestring = name + " (" + nickname + ")"
        } else {
            namestring = name;
        }
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        var friendlyEnd = dateTools.makeFriendlyDates(end);
        var friendlyRestriction = '';
        // Let's create a restriction message we can insert
        if (restriction.length !== "none") {
            switch (restriction) {
                case "t":
                    friendlyRestriction = "Tuesdays ";
                    break;
                case "r":
                    friendlyRestriction = "Thursdays ";
                    break;
                case "s":
                    friendlyRestriction = "Sundays ";
                    break;
            }
        }

        //Handle channel posts for absences and lates. Shorten if only a single day.
        if (this_command === "absent") {
            if (start != end) {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(
                        `${namestring} will be absent ${friendlyRestriction}from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`,
                    )
                    .then((message) => {
                        this.storeSpeedyMessageDetails(name, start, end, message.id);
                    });
            } else {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(`${namestring} will be absent on ${friendlyStart}. They commented: ${reason}`)
                    .then((message) => {
                        this.storeSpeedyMessageDetails(name, start, end, message.id);
                    });
            }
        }
        if (this_command === "late") {
            if (start != end) {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(
                        `${namestring} will be late to raid ${friendlyRestriction}from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`,
                    )
                    .then((message) => {
                        this.storeSpeedyMessageDetails(name, start, end, message.id);
                    });
            } else {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(`${namestring} will be late on ${friendlyStart}. They commented: ${reason}`)
                    .then((message) => {
                        this.storeSpeedyMessageDetails(name, start, end, message.id);
                    });
            }
        }
    }

    storeSpeedyMessageDetails(name, start_date, end_date, message_id) {
        var messagePrep = this.absencedb.prepare(
            "INSERT INTO messages(discord_name, start_date, end_date, messageID) VALUES (?,?,?,?)",
        );
        messagePrep.run(name, start_date, end_date, message_id);
    }

    async removeSpeedyMessage(name, start_date, end_date) {
        var selectMessagePrep = this.absencedb.prepare(
            "SELECT messageID FROM messages WHERE discord_name = ? AND start_date = ? AND end_date = ?",
        );

        // Get the ID of the message that matches the above parameters
        var result = selectMessagePrep.get(name, start_date, end_date);
        var messageId = result ? result.messageID : null;

        // Now, delete that message from the attendance channel.
        var channel = client.channels.cache.get(`${process.env.attendance_channel}`);
        const messages = await channel.messages.fetch({ limit: 100 });

        // Filter and delete old messages
        messages
            .filter((message) => {
                return message.author.bot && message.id == messageId;
            })
            .forEach(async (message) => {
                try {
                    message.delete();
                    console.log(`Deleted message: ${message.content}`);
                } catch (error) {
                    console.error("Error deleting message:", error);
                }
            });

        // Now, cleanup the messages table.
        var cleanupMessagesTablePrep = this.absencedb.prepare("DELETE FROM messages WHERE messageID = ?");
        cleanupMessagesTablePrep.run(messageId);
    }
}

class DataDisplayTools {
    constructor() {
        this.absencedb = new sqlite3("./db/attendance.db");
    }

    show(name, choice, length) {
        var absentCount = 0;
        var lateCount = 0;
        //Get just the user's absences.
        if (choice === "mine") {
            var sql = this.absencedb.prepare(
                "SELECT * FROM attendance WHERE end_date >= date('now','localtime') AND discord_name = ? AND kind = 'absent' ORDER BY end_date ASC, name LIMIT 20",
            );
            var absResults = sql.all(name);
        } else if (choice === "today") {
            var sql = this.absencedb.prepare(
                "SELECT * FROM attendance WHERE end_date = date('now','localtime') AND kind = 'absent' ORDER BY end_date ASC, name LIMIT 20",
            );
            var absResults = sql.all();
        } else {
            //Get all absences for today and later.
            var sql = this.absencedb.prepare(
                "SELECT * FROM attendance WHERE kind = 'absent' AND (end_date BETWEEN date('now','localtime') AND date('now','+8 days')) ORDER BY end_date ASC, name LIMIT 20",
            );
            var absResults = sql.all();
        }

        const absentEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Upcoming absences").setFooter({
            text: "These absences are known to the Infinite Speedyflight. Use this information wisely.",
        });
        if (length === "short") {
            absResults.forEach((row) => {
                absentEmbed.addFields({
                    name: row.name,
                    value: dateTools.makeFriendlyDates(row.end_date),
                    inline: false,
                });
                absentCount += 1;
            });
        } else {
            absResults.forEach((row) => {
                absentEmbed.addFields({
                    name: row.name,
                    value: "Date: " + dateTools.makeFriendlyDates(row.end_date) + "\nComments: " + row.comment,
                    inline: false,
                });
                absentCount += 1;
            });
        }

        //Get all tardiness from today and later.
        if (choice === "mine") {
            var late_sql = this.absencedb.prepare(
                "SELECT * FROM attendance WHERE end_date >= date('now','localtime') AND discord_name = ? AND kind = 'late' ORDER BY end_date ASC, name LIMIT 20",
            );
            var lateResults = late_sql.all(name);
        } else if (choice === "today") {
            var late_sql = this.absencedb.prepare(
                "SELECT * FROM attendance WHERE end_date = date('now','localtime') AND kind = 'late' ORDER BY end_date ASC, name LIMIT 20",
            );
            var lateResults = late_sql.all();
        } else {
            var late_sql = this.absencedb.prepare(
                "SELECT * FROM attendance WHERE end_date BETWEEN date('now','localtime') AND date('now', '+8 days') AND kind = 'late' ORDER BY end_date ASC, name LIMIT 20",
            );
            var lateResults = late_sql.all();
        }

        const lateEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Upcoming tardiness").setFooter({
            text: "This tardiness is known to the Infinite Speedyflight. Use this information wisely.",
        });
        if (length === "short") {
            lateResults.forEach((row) => {
                lateEmbed.addFields({
                    name: row.name,
                    value: dateTools.makeFriendlyDates(row.end_date),
                });
                lateCount += 1;
            });
        } else {
            lateResults.forEach((row) => {
                lateEmbed.addFields({
                    name: row.name,
                    value: "Date: " + dateTools.makeFriendlyDates(row.end_date) + "\nComments: " + row.comment,
                });
                lateCount += 1;
            });
        }
        return {
            absentEmbed,
            lateEmbed,
            absentCount,
            lateCount,
        };
    }
}

class DatabaseCleanup {
    constructor() {
        this.absencedb = new sqlite3("./db/attendance.db");
    }
    cleanAbsences() {
        //Expire entries that occurred more than three days ago.
        let sql = this.absencedb.prepare("DELETE FROM attendance WHERE end_date < date('now', '-3 days')");
        sql.run();
    }

    cleanMessages() {
        //Expire entries that occurred more than three days ago.
        let sql = this.absencedb.prepare("DELETE FROM messages WHERE end_date < date('now', '-3 days')");
        sql.run();
    }

    vacuumDatabases() {
        let sql = this.absencedb.prepare("VACUUM");
        sql.run();
    }
}

module.exports = {
    attendanceTools,
    CreateDatabase,
    DatabaseCleanup,
    DataDisplayTools
};