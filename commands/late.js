module.exports = {
	name: 'late',
	description: 'Let us know you will be late to raid!',
	usage: '[Month Day Comment]',
	notes: 'This command marks you late on a given day and allows you to supply a comment. It will then post this to the attendance channel for you.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Example:** `!late July 4 Feeding Clara` (Late on July 4 -- marks you on-time for just that date and supplies the reason "Feeding Clara")',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataEntryTools();
		absenceDBHelper.late(message, args);
	},
};