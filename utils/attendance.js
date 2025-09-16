import { EmbedBuilder } from "discord.js";
import sqlite3 from "better-sqlite3";
import SqlString from "sqlstring";
import { client } from "./speedyutils.js";

//Date-related
import { dateTools } from "./datetools.js";
const dateUtils = new dateTools();

//DB
class CreateAttendanceDatabase {
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

class AttendanceTools {
    constructor() {
        this.absencedb = new sqlite3("./db/attendance.db");
    }

    addAbsence(name, nickname, sy, sm, sd, end, comment, kind) {
        if (nickname === null) {
            nickname = name;
        }
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

        // We're escaping the name because that's how it came in from the Web.
        // TODO: better name matching, as this is looking for discord_name not nickname.
        if (process.env.ENABLE_ATTENDANCE_API === "true") {
            let apidb = new sqlite3("./db/apiAttendance.db");
            var cancelApiPrep = apidb.prepare(
                "DELETE FROM attendance WHERE (name = ? AND end_date = ?)",
            );
            cancelApiPrep.run(SqlString.escape(name), date);
        }

    }

    processDBUpdate(name, nickname, kind, comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day) {
        const startDate = new Date(start_year, start_month, start_day);
        const endDate = new Date(end_year, end_month, end_day);

        const result = dateUtils.eachDayOfInterval(startDate, endDate);
        this.processDBUpdateFilterLoop(result, kind, name, nickname, comment, restriction);
    }

    // prettier-ignore
    processDBUpdateFilterLoop(result, kind, name, nickname, comment, restriction, end_date) {
        for (let i = 0; i < result.length; i++) {
            let short_item = result[i];
            let newDate = new Date(short_item);

            if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
                console.log('Invalid date:', short_item);
                continue; // Skip this iteration if the date is invalid
            }

            let newYear = (newDate.getFullYear()).toString();
            let newMonth = (newDate.getMonth() + 1).toString(); // Months are zero-based
            let newDay = (newDate.getDate()).toString();

            // Format the date string as YYYY-MM-DD
            let dateString = `${newYear}-${newMonth.toString().padStart(2, '0')}-${newDay.toString().padStart(2, '0')}`;

            this.filterDBUpdate(restriction, name, nickname, newYear, newMonth, newDay, dateString, comment, short_item, kind);
        }
    }

    // prettier-ignore
    filterDBUpdate(restriction, name, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind) {
        if (restriction === "none") {
            if (dateUtils.isTuesday(short_item) || dateUtils.isThursday(short_item) || dateUtils.isSunday(short_item)) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        } else if (restriction === "t") {
            if (dateUtils.isTuesday(short_item)) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        } else if (restriction === "r") {
            if (dateUtils.isThursday(short_item)) {
                this.doDBUpdate(name, nickname, newYear, newMonth, newDay, newDate, comment, kind);
            }
        } else if (restriction === "s") {
            if (dateUtils.isSunday(short_item)) {
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
        var friendlyStart = dateUtils.makeFriendlyDates(start);
        var namestring = "";
        if (nickname != name && nickname !== null) {
            namestring = name + " (" + nickname + ")"
        } else {
            namestring = name;
        }
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        var friendlyEnd = dateUtils.makeFriendlyDates(end);
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

        var reasonInsert = '';
        switch (this_command) {
            case "absent":
                reasonInsert += `absent ${friendlyRestriction}from`;
                break;
            case "late":
                reasonInsert += `late to raid ${friendlyRestriction}from`;
                break;
        }

        var commentInsert = '';
        if (reason.length > 0) {
            commentInsert = "They commented: " + reason;
        }

        //Handle channel posts for absences and lates. Shorten if only a single day.
        if (start != end) {
            client.channels.cache
                .get(`${process.env.ATTENDANCE_CHANNEL}`)
                .send(
                    `${namestring} will be ${reasonInsert} ${friendlyStart} until ${friendlyEnd}. ${commentInsert}`,
                )
                .then((message) => {
                    this.storeSpeedyMessageDetails(name, start, end, message.id);
                });
        } else {
            client.channels.cache
                .get(`${process.env.ATTENDANCE_CHANNEL}`)
                .send(`${namestring} will be ${this_command} on ${friendlyStart}. ${commentInsert}`)
                .then((message) => {
                    this.storeSpeedyMessageDetails(name, start, end, message.id);
                });
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
        var channel = client.channels.cache.get(`${process.env.ATTENDANCE_CHANNEL}`);
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

    show(name, choice) {
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

        absResults.forEach((row) => {
            let commentString = "";
            if (row.comment.length > 0) {
                commentString = `\nComments: ${row.comment}`
            }
            absentEmbed.addFields({
                name: row.name,
                value: "Date: " + dateUtils.makeFriendlyDates(row.end_date) + commentString,
                inline: false,
            });
            absentCount += 1;
        });

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
        lateResults.forEach((row) => {
            let commentString = "";
            if (row.comment.length > 0) {
                commentString = `\nComments: ${row.comment}`
            }
            lateEmbed.addFields({
                name: row.name,
                value: "Date: " + dateUtils.makeFriendlyDates(row.end_date) + commentString,
            });
            lateCount += 1;
        });

        const apiEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Via Corkboard").setFooter({
            text: "These items are known to the Infinite Speedyflight. Use this information wisely.",
        });

        //Get all items from the API submissions.
        if (choice === "mine") {
            let apidb = new sqlite3("./db/apiAttendance.db");
            var api_sql = apidb.prepare(
                "SELECT * FROM attendance WHERE end_date >= date('now','localtime') AND name = ? ORDER BY end_date ASC, name LIMIT 20",
            );
            var apiResults = api_sql.all(SqlString.escape(name));
        } else if (choice === "today") {
            let apidb = new sqlite3("./db/apiAttendance.db");
            var api_sql = apidb.prepare(
                "SELECT * FROM attendance WHERE end_date = date('now','localtime') ORDER BY end_date ASC, name LIMIT 20",
            );
            var apiResults = api_sql.all();
        } else {
            let apidb = new sqlite3("./db/apiAttendance.db");
            var api_sql = apidb.prepare(
                "SELECT * FROM attendance WHERE end_date BETWEEN date('now','localtime') AND date('now', '+8 days') ORDER BY end_date ASC, name LIMIT 20",
            );
            var apiResults = api_sql.all();
        }
        apiResults.forEach((row) => {
            let commentString = "";
            if (row.comment.length > 0) {
                commentString = `\nComments: ${row.comment}`
            }
            apiEmbed.addFields({
                name: row.name,
                value: "Date: " + dateUtils.makeFriendlyDates(row.end_date) + commentString,
            });
        });

        return {
            absentEmbed,
            lateEmbed,
            apiEmbed,
            absentCount,
            lateCount,
        };
    }

    summarize() {
        var sql = this.absencedb.prepare(
            "SELECT * FROM attendance WHERE end_date = date('now','localtime') AND kind = 'absent' ORDER BY end_date ASC, name LIMIT 20",
        );

        var late_sql = this.absencedb.prepare(
            "SELECT * FROM attendance WHERE end_date = date('now','localtime') AND kind = 'late' ORDER BY end_date ASC, name LIMIT 20",
        );

        let apidb = new sqlite3("./db/apiAttendance.db");
        var api_sql = apidb.prepare(
            "SELECT * FROM attendance WHERE end_date BETWEEN date('now','localtime') AND date('now', '+8 days') ORDER BY end_date ASC, name LIMIT 20",
        );

        var absResults = sql.all();
        var lateResults = late_sql.all();
        var apiResults = api_sql.all();

        const absentEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Absent Today").setFooter({
            text: "These absences are known to the Infinite Speedyflight. Use this information wisely.",
        });

        const lateEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Late Today").setFooter({
            text: "This tardiness is known to the Infinite Speedyflight. Use this information wisely.",
        });

        const apiEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Via Corkboard").setFooter({
            text: "These items are known to the Infinite Speedyflight. Use this information wisely.",
        });

        let absentNames = [];
        let lateNames = [];

        absResults.forEach((row) => {
            absentNames.push(row.name);
        });

        absentEmbed.addFields({
            name: "Players",
            value: absentNames.length > 0 ? absentNames.toSorted().join(", ") : "None",
            inline: false,
        });

        lateResults.forEach((row) => {
            lateNames.push(row.name);
        });

        lateEmbed.addFields({
            name: "Players",
            value: lateNames.length > 0 ? lateNames.toSorted().join(", ") : "None",
            inline: false,
        });

        apiResults.forEach((row) => {
            let commentString = "";
            if (row.comment.length > 0) {
                commentString = `\nComments: ${row.comment}`
            }
            apiEmbed.addFields({
                name: row.name,
                value: "Date: " + dateUtils.makeFriendlyDates(row.end_date) + commentString,
            });
        });

        return {
            absentEmbed,
            lateEmbed,
            apiEmbed,
        };
    }
}

class AttendanceDatabaseCleanup {
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

export { AttendanceDatabaseCleanup, AttendanceTools, CreateAttendanceDatabase, DataDisplayTools };
