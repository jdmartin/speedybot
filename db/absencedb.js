require("dotenv").config();
const { ChannelType, EmbedBuilder } = require("discord.js");
const sqlite3 = require("better-sqlite3");
const utils = require("../utils/speedyutils.js");
const nameutils = require("../utils/nameutils.js");
const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();
const getNicknames = nameutils.asyncGetName;
const client = utils.client;
//Date-related
const offset = "T11:52:29.478Z";
var eachDayOfInterval = require("date-fns/eachDayOfInterval");
var format = require("date-fns/format");
var isTuesday = require("date-fns/isTuesday");
var isThursday = require("date-fns/isThursday");
var isSunday = require("date-fns/isSunday");
var isValid = require("date-fns/isValid");
var parseISO = require("date-fns/parseISO");
//Other Tools
var SqlString = require("sqlstring");

let absencedb = new sqlite3("./db/absence.db");

class CreateDatabase {
    startup() {
        var absenceDBPrep = absencedb.prepare(
            "CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `discord_name` TEXT, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `end_date`, `comment` TEXT)",
        );
        var lateDBPrep = absencedb.prepare(
            "CREATE TABLE IF NOT EXISTS `latecomers` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `discord_name` TEXT, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `start_date`, `comment` TEXT)",
        );
        var messagesDBPrep = absencedb.prepare(
            "CREATE TABLE IF NOT EXISTS `messages` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `discord_name` TEXT, `start_date` TEXT, `end_date` TEXT, `messageID` TEXT, `kind` TEXT)",
        );
        absenceDBPrep.run();
        lateDBPrep.run();
        messagesDBPrep.run();
    }
}

class AttendanceTools {
    //Commands absent, late, ontime, and present for scheduling.

    async absent(message, restriction, args) {
        //Just use the first three letters of the month to avoid confusion:
        let shortMonth = args[0].substring(0, 3);
        if (args[2]) {
            var shortEndMonth = args[2].substring(0, 3);
        }

        //Make sure we have start and end dates.
        if (dateTools.checkIsMonth(shortMonth)) {
            var startYear = dateTools.determineYear(shortMonth, args[1].replace(/\D/g, ""));
            if (dateTools.checkIsDate(shortMonth, args[1].replace(/\D/g, ""), startYear)) {
                var startDay = args[1].replace(/\D/g, "");
                var combinedStartDate = shortMonth + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedStartDate, undefined);
            }
            //Process Comments
            var comment = args.slice(2).join(" ");
        }
        if (dateTools.checkIsMonth(shortEndMonth) && dateTools.checkIsDayOfMonth(args[3].replace(/\D/g, ""))) {
            //Make sure end year is equal or greater to start year.
            ///HMM
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(shortEndMonth, args[3].replace(/\D/g, ""));
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(shortEndMonth, args[3].replace(/\D/g, ""), endYear)) {
                var endDay = args[3].replace(/\D/g, "");
                var combinedEndDate = shortEndMonth + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
                //Process Comments
                var comment = args.slice(4).join(" ");
            }
        } else {
            var endDate = startDate;
            var comment = args.slice(2).join(" ");
        }
        //Get the nickname
        const nickname = await getNicknames(message);
        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            //If we have a range of days, let's store them individually...
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            this.processDBUpdate(message, nickname, "absent", startDate, endDate, comment, restriction);
            this.generateResponse(message, nickname, "absent", "present", startDate, endDate, comment);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    async late(message, restriction, args) {
        //Just use the first three letters of the month to avoid confusion:
        let shortMonth = args[0].substring(0, 3);
        if (args[2]) {
            var shortEndMonth = args[2].substring(0, 3);
        }

        var startYear = dateTools.determineYear(shortMonth, args[1].replace(/\D/g, ""));
        //Make sure we have a date.
        if (dateTools.checkIsMonth(shortMonth)) {
            if (dateTools.checkIsDate(args)) {
                var startDay = args[1].replace(/\D/g, "");
                let combinedDate = shortMonth + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedDate, undefined);
                //Process a comment, if supplied.
                var comment = args.slice(2).join(" ");
            }
        }
        if (dateTools.checkIsMonth(shortEndMonth) && dateTools.checkIsDayOfMonth(args[3].replace(/\D/g, ""))) {
            //Make sure end year is equal or greater to start year.
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(shortEndMonth, args[3].replace(/\D/g, ""));
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(shortEndMonth, args[3].replace(/\D/g, ""), endYear)) {
                var endDay = args[3].replace(/\D/g, "");
                var combinedEndDate = shortEndMonth + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
                //Process Comments
                var comment = args.slice(4).join(" ");
            }
        } else {
            var endDate = startDate;
            var comment = args.slice(2).join(" ");
        }
        //Get the nickname
        const nickname = await getNicknames(message);
        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            //If we have a range of days, let's store them individually...
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            this.processDBUpdate(message, nickname, "late", startDate, endDate, comment, restriction);
            this.generateResponse(message, nickname, "late", "ontime", startDate, endDate, comment);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    async ontime(message, restriction, args) {
        //Just use the first three letters of the month to avoid confusion:
        let shortMonth = args[0].substring(0, 3);
        if (args[2]) {
            var shortEndMonth = args[2].substring(0, 3);
        }

        //Make sure we have a date.
        var startYear = dateTools.determineYear(shortMonth, args[1].replace(/\D/g, ""));
        if (dateTools.checkIsMonth(shortMonth)) {
            if (dateTools.checkIsDate(args)) {
                var startDay = args[1].replace(/\D/g, "");
                let combinedDate = shortMonth + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedDate, undefined);
            }
        }
        if (dateTools.checkIsMonth(shortEndMonth)) {
            //Make sure end year is equal or greater to start year.
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(shortEndMonth, args[3].replace(/\D/g, ""));
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(shortEndMonth, args[3].replace(/\D/g, ""), endYear)) {
                var endDay = args[3].replace(/\D/g, "");
                var combinedEndDate = shortEndMonth + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
            }
        } else {
            var endDate = startDate;
        }
        //Get nickname
        const nickname = await getNicknames(message);
        //Only update db if we have a valid date.
        if (isValid(parseISO(startDate))) {
            this.processDBUpdate(message, nickname, "ontime", startDate, endDate, undefined, restriction);
            if (startDate != endDate) {
                message.author.send(
                    `Ok, I've got you down as on-time from ${dateTools.makeFriendlyDates(
                        startDate,
                    )} until ${dateTools.makeFriendlyDates(endDate)}. See you then!`,
                );
            } else {
                message.author.send(
                    `Ok, I've got you down as on-time on ${dateTools.makeFriendlyDates(startDate)}. See you then!`,
                );
            }
        }
    }

    async present(message, restriction, args) {
        //Just use the first three letters of the month to avoid confusion:
        let shortMonth = args[0].substring(0, 3);
        if (args[2]) {
            var shortEndMonth = args[2].substring(0, 3);
        }

        //Make sure we have start and end dates.
        var startYear = dateTools.determineYear(shortMonth, args[1].replace(/\D/g, ""));
        if (dateTools.checkIsMonth(shortMonth)) {
            if (dateTools.checkIsDate(shortMonth, args[1].replace(/\D/g, ""), startYear)) {
                var startDay = args[1].replace(/\D/g, "");
                var combinedStartDate = shortMonth + " " + startDay + " " + startYear;
                var startDate = dateTools.validateDates(message, combinedStartDate, undefined);
            }
        }
        if (dateTools.checkIsMonth(shortEndMonth)) {
            //Make sure end year is equal or greater to start year.
            if (dateTools.getCurrentYear() >= startYear) {
                var endYear = dateTools.determineYear(shortEndMonth, args[3].replace(/\D/g, ""));
            } else {
                var endYear = startYear;
            }
            if (dateTools.checkIsDate(shortEndMonth, args[3].replace(/\D/g, ""), endYear)) {
                var endDay = args[3].replace(/\D/g, "");
                var combinedEndDate = shortEndMonth + " " + endDay + " " + endYear;
                var endDate = dateTools.validateDates(message, undefined, combinedEndDate);
            }
        } else {
            var endDate = startDate;
        }
        //Get nickname
        const nickname = await getNicknames(message);
        //Make sure dates are good.
        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            //If we have a range of days, let's store them individually...
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            this.processDBUpdate(message, nickname, "present", startDate, endDate, undefined, restriction);
            this.generateResponse(message, nickname, "present", "absent", startDate, endDate, undefined);
        } else {
            message.reply("Sorry, something went wrong. Please tell Doolan what command you typed.");
        }
    }

    //command addAbsence, addLate, addOntime, and addPresent, processDBUpdate, for updating the db.
    addAbsence(message, nickname, sy, sm, sd, end, comment) {
        if (nickname) {
            var identity = nickname;
        } else {
            var identity = message.author.username;
        }
        var absencePrep = absencedb.prepare(
            "INSERT INTO absences(name, discord_name, start_year, start_month, start_day, end_date, comment) VALUES (?,?,?,?,?,?,?)",
        );
        absencePrep.run(identity, message.author.username, sy, sm, sd, end, comment);
    }

    addPresent(message, sm, sd) {
        var presentPrep = absencedb.prepare(
            "DELETE FROM absences WHERE (discord_name = ? AND start_month = ? AND start_day = ?)",
        );
        presentPrep.run(message.author.username, sm, sd);
    }

    addLate(message, nickname, sy, sm, sd, start, comment) {
        if (nickname) {
            var identity = nickname;
        } else {
            var identity = message.author.username;
        }
        var latePrep = absencedb.prepare(
            "INSERT INTO latecomers(name, discord_name, start_year, start_month, start_day, start_date, comment) VALUES (?,?,?,?,?,?,?)",
        );
        latePrep.run(identity, message.author.username, sy, sm, sd, start, comment);
    }

    addOntime(message, sm, sd) {
        var ontimePrep = absencedb.prepare(
            "DELETE FROM latecomers WHERE (discord_name = ? AND start_month = ? AND start_day = ?)",
        );
        ontimePrep.run(message.author.username, sm, sd);
    }

    storeSpeedyMessageDetails(name, start_date, end_date, message_id, kind) {
        var messagePrep = absencedb.prepare(
            "INSERT INTO messages(discord_name, start_date, end_date, messageID, kind) VALUES (?,?,?,?,?)",
        );
        messagePrep.run(name, start_date, end_date, message_id, kind);
    }

    async removeSpeedyMessage(name, start_date, end_date, kind) {
        var selectMessagePrep = absencedb.prepare(
            "SELECT messageID FROM messages WHERE discord_name = ? AND start_date = ? AND end_date = ? AND kind = ?",
        );

        // Get the ID of the message that matches the above parameters
        var result = selectMessagePrep.get(name, start_date, end_date, kind);
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
                    await message.delete();
                    console.log(`Deleted message: ${message.content}`);
                } catch (error) {
                    console.error("Error deleting message:", error);
                }
            });

        // Now, cleanup the messages table.
        var cleanupMessagesTablePrep = absencedb.prepare("DELETE FROM messages WHERE messageID = ?");
        cleanupMessagesTablePrep.run(messageId);
    }

    processDBUpdate(message, nickname, kind, startDate, endDate, comment, restriction) {
        //Make sure there's a comment:
        if (comment == undefined) {
            comment = "";
        }

        if (isValid(parseISO(startDate)) && isValid(parseISO(endDate))) {
            //NOTE: Since raid days are Tue, Thu, Sun... we'll store only those.
            const result = eachDayOfInterval({
                start: new Date(parseISO(startDate)),
                end: new Date(parseISO(endDate)),
            });
            this.processDBUpdateFilterLoop(result, kind, message, nickname, comment, restriction);
        }
    }

    // prettier-ignore
    processDBUpdateFilterLoop(result, kind, message, nickname, comment, restriction) {
        for (let i = 0; i < result.length; i++) {
            let short_item = result[i].toISOString().split("T")[0];
            let newYear = short_item.split("-")[0];
            let newMonth = short_item.split("-")[1];
            let newDay = short_item.split("-")[2];
            let newDate = newYear + "-" + newMonth + "-" + newDay;
            this.filterDBUpdate(restriction, message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind);
        }
    }

    // prettier-ignore
    filterDBUpdate(restriction, message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind) {
        if (restriction === "") {
            if (isTuesday(parseISO(short_item)) || isThursday(parseISO(short_item)) || isSunday(parseISO(short_item))) {
                this.doDBUpdate(message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind);
            }
        } else if (restriction === "Tuesdays") {
            if (isTuesday(parseISO(short_item))) {
                this.doDBUpdate(message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind);
            }
        } else if (restriction === "Thursdays") {
            if (isThursday(parseISO(short_item))) {
                this.doDBUpdate(message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind);
            }
        } else if (restriction === "Sundays") {
            if (isSunday(parseISO(short_item))) {
                this.doDBUpdate(message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind);
            }
        }
    }

    doDBUpdate(message, nickname, newYear, newMonth, newDay, newDate, comment, short_item, kind) {
        if (kind === "absent") {
            this.addAbsence(message, nickname, newYear, newMonth, newDay, newDate, SqlString.escape(comment));
        }
        if (kind === "present") {
            this.addPresent(message, newMonth, newDay);
        }
        if (kind === "late") {
            this.addLate(message, nickname, newYear, newMonth, newDay, newDate, SqlString.escape(comment));
        }
        if (kind === "ontime") {
            this.addOntime(message, newMonth, newDay);
        }
    }

    //command generateResponse for notifying the user of what has been done.
    generateResponse(message, nickname, this_command, undo_command, start, end, reason) {
        //Create some helpers and ensure needed parts:
        var friendlyStart = dateTools.makeFriendlyDates(start);
        var friendlyStartUndo = format(new Date(start + offset), "MMM dd");
        var username = message.author.username;
        var namestring = "";
        if (nickname != username) {
            namestring = username + " (" + nickname + ")"
        } else {
            namestring = username;
        }
        //Make certain there's an end value.
        if (!end) {
            end = start;
        }
        var friendlyEnd = dateTools.makeFriendlyDates(end);
        var friendlyEndUndo = format(new Date(end + offset), "MMM dd");
        //Select the appropriate type of response, and shorten if it's a single day.
        if (message.channel.type === ChannelType.DM) {
            if (start != end) {
                message.reply(
                    `Ok, I've marked you ${this_command} from ${friendlyStart} until ${friendlyEnd}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo} ${friendlyEndUndo} `,
                );
            } else {
                message.reply(
                    `Ok, I've marked you ${this_command} on ${friendlyStart}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo}`,
                );
            }
        } else {
            if (start != end) {
                message.member.send(
                    `Ok, I've marked you ${this_command} from ${friendlyStart} until ${friendlyEnd}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo} ${friendlyEndUndo} `,
                );
            } else {
                message.member.send(
                    `Ok, I've marked you ${this_command} on ${friendlyStart}.  \n\nTo undo this, type: !${undo_command} ${friendlyStartUndo}`,
                );
            }
        }
        //Handle channel posts for absences and lates. Shorten if only a single day.
        if (this_command === "absent") {
            if (start != end) {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(
                        `${namestring} will be absent from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`,
                    )
                    .then((message) => {
                        this.storeSpeedyMessageDetails(username, start, end, message.id, "absent");
                    });
            } else {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(`${namestring} will be absent on ${friendlyStart}. They commented: ${reason}`)
                    .then((message) => {
                        this.storeSpeedyMessageDetails(username, start, end, message.id, "absent");
                    });
            }
        }
        if (this_command === "late") {
            if (start != end) {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(
                        `${namestring} will be late to raid from ${friendlyStart} until ${friendlyEnd}. They commented: ${reason}`,
                    )
                    .then((message) => {
                        this.storeSpeedyMessageDetails(username, start, end, message.id, "late");
                    });
            } else {
                client.channels.cache
                    .get(`${process.env.attendance_channel}`)
                    .send(`${namestring} will be late on ${friendlyStart}. They commented: ${reason}`)
                    .then((message) => {
                        this.storeSpeedyMessageDetails(username, start, end, message.id, "late");
                    });
            }
        }
        if (this_command === "ontime") {
            this.removeSpeedyMessage(username, start, end, "late");
        }
        if (this_command === "present") {
            this.removeSpeedyMessage(username, start, end, "absent");
        }
    }
}

class DataDisplayTools {
    show(message, args) {
        //Convert arg0 and arg1 for string matching
        if (args[0]) {
            var lowerArgZero = args[0].toLowerCase();
        }

        //Get just the user's absences.
        if (lowerArgZero === "mine") {
            var sql = absencedb.prepare(
                "SELECT * FROM absences WHERE end_date >= date('now','localtime') AND discord_name = ? ORDER BY end_date ASC, name",
            );
            var absResults = sql.all(message.author.username);
        } else if (lowerArgZero === "today") {
            var sql = absencedb.prepare(
                "SELECT * FROM absences WHERE end_date = date('now','localtime') ORDER BY end_date ASC, name",
            );
            var absResults = sql.all();
        } else {
            //Get all absences for today and later.
            var sql = absencedb.prepare(
                "SELECT * FROM absences WHERE end_date BETWEEN date('now','localtime') AND date('now','+8 days') ORDER BY end_date ASC, name",
            );
            var absResults = sql.all();
        }

        const absentEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("Upcoming absences").setFooter({
            text: "These absences are known to the Infinite Speedyflight. Use this information wisely.",
        });

        absResults.forEach((row) => {
            absentEmbed.addFields({
                name: row.name,
                value: "Date: " + dateTools.makeFriendlyDates(row.end_date) + "\nComments: " + row.comment,
                inline: false,
            });
        });

        //Get all tardiness from today and later.
        if (lowerArgZero === "mine") {
            var late_sql = absencedb.prepare(
                `SELECT * FROM latecomers WHERE start_date >= date('now','localtime') AND discord_name = ? ORDER BY start_date ASC, name`,
            );
            var lateResults = late_sql.all(message.author.username);
        } else if (lowerArgZero === "today") {
            var late_sql = absencedb.prepare(
                "SELECT * FROM latecomers WHERE start_date = date('now','localtime') ORDER BY start_date ASC, name",
            );
            var lateResults = late_sql.all();
        } else {
            var late_sql = absencedb.prepare(
                "SELECT * FROM latecomers WHERE start_date BETWEEN date('now','localtime') AND date('now', '+8 days') ORDER BY start_date ASC, name",
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
        });
        message.channel.send({
            embeds: [absentEmbed, lateEmbed],
        });
    }
}

class DatabaseCleanup {
    cleanAbsences() {
        //Expire entries that occurred more than one month ago.
        let sql = absencedb.prepare("DELETE FROM absences WHERE end_date < date('now', '-3 days')");
        sql.run();
    }

    cleanLatecomers() {
        //Expire entries that occurred more than one month ago.
        let sql = absencedb.prepare("DELETE FROM latecomers WHERE start_date < date('now', '-3 days')");
        sql.run();
    }

    vacuumDatabases() {
        let sql = absencedb.prepare("VACUUM");
        sql.run();
    }
}

module.exports = {
    AttendanceTools,
    CreateDatabase,
    DatabaseCleanup,
    DataDisplayTools,
};
