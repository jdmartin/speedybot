module.exports = {
    name: "ontime",
    description: "Tell us you will not be late to raid!",
    usage: "[Month Day Month Day]",
    notes: "This command cancels out an entry made with !late.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Example:** `!ontime July 4` (Ontime on July 4 -- marks you on-time for just that date)\n**Date Range Example:** `!ontime Jul 4 Jul 21` (Ontime from July 4 until July 21 -- removes any lateness that matches this start and end date.",
    execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.AttendanceTools();
        if (args[0] == undefined) {
            message.reply("Sorry, I need a bit more information than that...");
        } else {
            absenceDBHelper.ontime(message, "", args);
        }
    },
};
