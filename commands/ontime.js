module.exports = {
	name: 'ontime',
	description: 'Tell us you will not be late to raid!',
	usage: '[Month Day]',
	notes: 'This command cancels out an entry made with !late.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Example:** `!ontime July 4` (Ontime on July 4 -- marks you on-time for just that date)',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataEntryTools();
		absenceDBHelper.ontime(message, args);
	},
};