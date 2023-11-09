const sqlite3 = require("better-sqlite3");
const utils = require("../utils/speedyutils.js");
const client = utils.client;
//Date-related
const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();
const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const isTuesday = require("date-fns/isTuesday");
const isThursday = require("date-fns/isThursday");
const isSunday = require("date-fns/isSunday");
const parseISO = require("date-fns/parseISO");

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
        const result = eachDayOfInterval({
            start: new Date(start_year, start_month, start_day),
            end: new Date(end_year, end_month, end_day),
        });
        this.processDBUpdateFilterLoop(result, kind, name, comment, restriction, code);
    }

    // prettier-ignore
    processDBUpdateFilterLoop(result, kind, name, comment, restriction, code) {
        for (let i = 0; i < result.length; i++) {
            let short_item = result[i].toISOString().split("T")[0];
            let newYear = short_item.split("-")[0];
            let newMonth = short_item.split("-")[1];
            let newDay = short_item.split("-")[2];
            let newDate = newYear + "-" + newMonth + "-" + newDay;
            this.filterDBUpdate(restriction, name, newYear, newMonth, newDay, newDate, comment, short_item, kind, code);
        }
    }

    // prettier-ignore
    filterDBUpdate(restriction, name, newYear, newMonth, newDay, newDate, comment, short_item, kind, code) {
        if (restriction === "none") {
            if (isTuesday(parseISO(short_item)) || isThursday(parseISO(short_item)) || isSunday(parseISO(short_item))) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        } else if (restriction === "Tuesday") {
            if (isTuesday(parseISO(short_item))) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        } else if (restriction === "Thursday") {
            if (isThursday(parseISO(short_item))) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        } else if (restriction === "Sunday") {
            if (isSunday(parseISO(short_item))) {
                this.doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code);
            }
        }
    }

    doDBUpdate(name, newYear, newMonth, newDay, newDate, comment, kind, code) {
        this.addAbsence(name, newYear, newMonth, newDay, newDate, comment, kind, code);
    }

    //command generateResponse for notifying the user of what has been done.
    generateResponse(name, this_command, start, end, reason, restriction) {
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
        } else {
            client.channels.cache
                .get(`${process.env.attendance_channel}`)
                .send(`Via Corkboard: ${namestring} will be ${this_command} on ${friendlyStart}. ${commentInsert}`)
        }
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