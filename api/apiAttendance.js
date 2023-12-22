const sqlite3 = require("better-sqlite3");
const utils = require("../utils/speedyutils.js");
const client = utils.client;
//Date-related
const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();

class attendanceTools {
    constructor() {
        this.absencedb = new sqlite3("./db/apiAttendance.db");
    }

    addAbsence(name, sy, sm, sd, end, comment, kind, code) {
        var absencePrep = this.absencedb.prepare(
            "INSERT INTO attendance(name, start_year, start_month, start_day, end_date, comment, kind, code) VALUES (?,?,?,?,?,?,?,?)",
        );
        absencePrep.run(name, sy, sm, sd, end, comment, kind, code);
    }

    cancelAbsence(name, code) {
        var cancelPrep = this.absencedb.prepare(
            "DELETE FROM attendance WHERE name = ? AND code = ?;"
        );
        cancelPrep.run(name, code);
    }

    processDBUpdate(name, kind, comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day, code) {
        const startDate = new Date(start_year, start_month, start_day);
        const endDate = new Date(end_year, end_month, end_day);

        const result = dateTools.eachDayOfInterval(startDate, endDate);
        this.processDBUpdateFilterLoop(result, kind, name, comment, restriction, code);
    }

    // prettier-ignore
    processDBUpdateFilterLoop(result, kind, name, comment, restriction, code) {
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

            this.filterDBUpdate(restriction, name, newYear, newMonth, newDay, dateString, comment, short_item, kind, code);
        }
    }

    // prettier-ignore
    filterDBUpdate(restriction, name, newYear, newMonth, newDay, newDate, comment, short_item, kind, code) {
        if (restriction === "none") {
            if (dateTools.isTuesday(short_item) || dateTools.isThursday(short_item) || dateTools.isSunday(short_item)) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        } else if (restriction === "Tuesday") {
            if (dateTools.isTuesday(short_item)) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        } else if (restriction === "Thursday") {
            if (dateTools.isThursday(short_item)) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        } else if (restriction === "Sunday") {
            if (dateTools.isSunday(short_item)) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        }
    }

    doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code) {
        this.addAbsence(name, newYear, newMonth, newDay, newDate, comment, kind, code);
    }

    //command generateResponse for notifying the user of what has been done.
    generateResponse(name, this_command, start, end, reason, restriction, code) {
        //Create some helpers and ensure needed parts:
        var friendlyStart = dateTools.makeFriendlyDates(start);
        var namestring = name;

        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        var friendlyEnd = dateTools.makeFriendlyDates(end);
        var friendlyRestriction = '';
        // Let's create a restriction message we can insert
        if (restriction !== "none") {
            switch (restriction) {
                case "Tuesday":
                    friendlyRestriction = "Tuesdays ";
                    break;
                case "Thursday":
                    friendlyRestriction = "Thursdays ";
                    break;
                case "Sunday":
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
                .get(`${process.env.attendance_channel}`)
                .send(
                    `Via Corkboard: ${namestring} will be ${reasonInsert} ${friendlyStart} until ${friendlyEnd}. ${commentInsert}`,
                )
                .then((message) => {
                    this.storeSpeedyMessageDetails(name, code, message.id);
                });
        } else {
            client.channels.cache
                .get(`${process.env.attendance_channel}`)
                .send(`Via Corkboard: ${namestring} will be ${this_command} on ${friendlyStart}. ${commentInsert}`)
                .then((message) => {
                    this.storeSpeedyMessageDetails(name, code, message.id);
                });
        }
    }

    storeSpeedyMessageDetails(name, code, message_id) {
        var messagePrep = this.absencedb.prepare(
            "INSERT INTO messages(name, code, messageID) VALUES (?,?,?)",
        );
        messagePrep.run(name, code, message_id);
    }

    async removeSpeedyMessage(name, code) {
        var selectMessagePrep = this.absencedb.prepare(
            "SELECT messageID FROM messages WHERE name = ? AND code = ?",
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

class DatabaseCleanup {
    constructor() {
        this.absencedb = new sqlite3("./db/apiAttendance.db");
    }
    cleanAbsences() {
        //Expire entries that occurred more than three days ago.
        let sql = this.absencedb.prepare("DELETE FROM attendance WHERE end_date < date('now', '-3 days')");
        sql.run();
    }

    vacuumDatabases() {
        let sql = this.absencedb.prepare("VACUUM");
        sql.run();
    }
}

module.exports = {
    attendanceTools,
    DatabaseCleanup,
};