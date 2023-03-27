require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const sqlite3 = require("better-sqlite3");
const utils = require("../utils/speedyutils.js");
const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();
const client = utils.client;
//Date-related
var eachDayOfInterval = require("date-fns/eachDayOfInterval");
var isTuesday = require("date-fns/isTuesday");
var isThursday = require("date-fns/isThursday");
var isSunday = require("date-fns/isSunday");
var isValid = require("date-fns/isValid");
var parseISO = require("date-fns/parseISO");
//Other Tools
var SqlString = require("sqlstring");

let absencedb = new sqlite3("./db/absence.db");

class AttendanceTools {
    //command addAbsence, addLate, addOntime, and addPresent, processDBUpdate, for updating the db.
    addAbsence(name, nickname, sy, sm, sd, end, comment) {
        var absencePrep = absencedb.prepare(
            "INSERT INTO absences(name, discord_name, start_year, start_month, start_day, end_date, comment) VALUES (?,?,?,?,?,?,?)",
        );
        absencePrep.run(nickname, name, sy, sm, sd, end, comment);
    }

    addPresent(name, sm, sd) {
        var presentPrep = absencedb.prepare(
            "DELETE FROM absences WHERE (discord_name = ? AND start_month = ? AND start_day = ?)",
        );
        presentPrep.run(name, sm, sd);
    }

    addLate(name, nickname, sy, sm, sd, start, comment) {
        var latePrep = absencedb.prepare(
            "INSERT INTO latecomers(name, discord_name, start_year, start_month, start_day, start_date, comment) VALUES (?,?,?,?,?,?,?)",
        );
        latePrep.run(nickname, name, sy, sm, sd, start, comment);
    }

    addOntime(name, sm, sd) {
        var ontimePrep = absencedb.prepare(
            "DELETE FROM latecomers WHERE (discord_name = ? AND start_month = ? AND start_day = ?)",
        );
        ontimePrep.run(name, sm, sd);
    }

    processDBUpdate(name, nickname, kind, startDate, endDate, comment) {
        //Make sure there's a comment:
        if (comment == undefined) {
            comment = "";
        }

        //Make sure there's a nickname:
        if (nickname == undefined) {
            nickname = name;
        }

        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            //If we have a range of days, let's store them individually...
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            //Setup some useful variables.
            let startDay = startDate.split("-")[2];
            let startMonth = startDate.split("-")[1];
            let endDay = endDate.split("-")[2];
            let endMonth = endDate.split("-")[1];
            //If no range of dates:
            if (endDay == startDay && endMonth == startMonth) {
                if (
                    isTuesday(parseISO(startDate)) ||
                    isThursday(parseISO(startDate)) ||
                    isSunday(parseISO(startDate))
                ) {
                    let newYear = startDate.split("-")[0];
                    let newMonth = startDate.split("-")[1];
                    let newDay = startDate.split("-")[2];
                    let newDate = newYear + "-" + newMonth + "-" + newDay;
                    if (kind === "absent") {
                        this.addAbsence(name, nickname, newYear, newMonth, newDay, newDate, SqlString.escape(comment));
                    }
                    if (kind === "present") {
                        this.addPresent(name, newMonth, newDay);
                    }
                    if (kind === "late") {
                        this.addLate(name, nickname, newYear, newMonth, newDay, newDate, SqlString.escape(comment));
                    }
                    if (kind === "ontime") {
                        this.addOntime(name, newMonth, newDay);
                    }
                }
            }
            //Do we have a range of dates?
            if (endDay > startDay || endMonth != startMonth) {
                const result = eachDayOfInterval({
                    start: new Date(parseISO(startDate)),
                    end: new Date(parseISO(endDate)),
                });
                for (let i = 0; i < result.length; i++) {
                    let short_item = result[i].toISOString().split("T")[0];
                    if (
                        isTuesday(parseISO(short_item)) ||
                        isThursday(parseISO(short_item)) ||
                        isSunday(parseISO(short_item))
                    ) {
                        let newYear = short_item.split("-")[0];
                        let newMonth = short_item.split("-")[1];
                        let newDay = short_item.split("-")[2];
                        let newDate = newYear + "-" + newMonth + "-" + newDay;
                        if (kind === "absent") {
                            this.addAbsence(
                                name,
                                nickname,
                                newYear,
                                newMonth,
                                newDay,
                                newDate,
                                SqlString.escape(comment),
                            );
                        }
                        if (kind === "present") {
                            this.addPresent(name, newMonth, newDay);
                        }
                        if (kind === "late") {
                            this.addLate(name, nickname, newYear, newMonth, newDay, newDate, SqlString.escape(comment));
                        }
                        if (kind === "ontime") {
                            this.addOntime(name, newMonth, newDay);
                        }
                    }
                }
            }
        }
    }

    //command generateResponse for notifying the user of what has been done.
    generateResponse(name, this_command, start, end, reason) {
        //Create some helpers and ensure needed parts:
        var friendlyStart = dateTools.makeFriendlyDates(start);
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        var friendlyEnd = dateTools.makeFriendlyDates(end);

        //Handle channel posts for absences and lates. Shorten if only a single day.
        if (this_command === "absent") {
            if (start != end) {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(
                        `${name} will be absent from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`,
                    );
            } else {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(`${name} will be absent on ${friendlyStart}. They commented: ${reason}`);
            }
        }
        if (this_command === "late") {
            if (start != end) {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(
                        `${name} will be late to raid from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`,
                    );
            } else {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(`${name} will be late on ${friendlyStart}. They commented: ${reason}`);
            }
        }
    }
}

class DataDisplayTools {
    show(name, choice, length) {
        var absentCount = 0;
        var lateCount = 0;
        //Get just the user's absences.
        if (choice === "mine") {
            var sql = absencedb.prepare(
                "SELECT * FROM absences WHERE end_date >= date('now','localtime') AND discord_name = ? ORDER BY end_date ASC, name LIMIT 20",
            );
            var absResults = sql.all(name);
        } else if (choice === "today") {
            var sql = absencedb.prepare(
                "SELECT * FROM absences WHERE end_date = date('now','localtime') ORDER BY end_date ASC, name LIMIT 20",
            );
            var absResults = sql.all();
        } else {
            //Get all absences for today and later.
            var sql = absencedb.prepare(
                "SELECT * FROM absences WHERE end_date BETWEEN date('now','localtime') AND date('now','+15 days') ORDER BY end_date ASC, name LIMIT 20",
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
                    value: "Date: " + dateTools.makeFriendlyDates(row.end_date),
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
            var late_sql = absencedb.prepare(
                `SELECT * FROM latecomers WHERE start_date >= date('now','localtime') AND discord_name = ? ORDER BY start_date ASC, name LIMIT 20`,
            );
            var lateResults = late_sql.all(name);
        } else if (choice === "today") {
            var late_sql = absencedb.prepare(
                "SELECT * FROM latecomers WHERE start_date = date('now','localtime') ORDER BY start_date ASC, name LIMIT 20",
            );
            var lateResults = late_sql.all();
        } else {
            var late_sql = absencedb.prepare(
                "SELECT * FROM latecomers WHERE start_date BETWEEN date('now','localtime') AND date('now', '+15 days') ORDER BY start_date ASC, name LIMIT 20",
            );
            var lateResults = late_sql.all();
        }

        const lateEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Upcoming tardiness").setFooter({
            text: "This tardiness is known to the Infinite Speedyflight. Use this information wisely.",
        });
        lateResults.forEach((row) => {
            lateEmbed.addFields({
                name: row.name,
                value: "Date: " + dateTools.makeFriendlyDates(row.start_date) + "\nComments: " + row.comment,
            });
            lateCount += 1;
        });
        return {
            absentEmbed,
            lateEmbed,
            absentCount,
            lateCount,
        };
    }
}

module.exports = {
    AttendanceTools,
    DataDisplayTools,
};
