module.exports = {
	name: 'absent',
	description: 'Tell us you will miss raid!',
	usage: '[Month Day Month Day Comment]',
	notes: 'This command marks you absent on a given day, or for a range of dates, and allows you to supply a comment. It will then post this to the attendance channel for you.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Single Date Example:** `!absent July 4 Feeding Clara` (Absent on July 4 -- marks you absent for just that date and supplies the reason "Feeding Clara")\n**Date Range Example:** `!absent July 4 July 11 Doing Side Quests` (Absent from July 4 until July 11th (inclusive) and supplies the reason "Doing Side Quests")',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.AttendanceTools();
		if (args[0] == undefined) {
			message.reply("Sorry, I need a bit more information than that...");
		}
		else {
			absenceDBHelper.absent(message, args);
		}
	},
};