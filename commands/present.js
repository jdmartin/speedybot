module.exports = {
	name: 'present',
	description: 'Tell us you will not miss raid!',
	usage: '[Month Day Month Day]',
	notes: 'This command cancels out an entry made with !absent.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Single Date Example:** `!present July 4` (Present on July 4 -- removes an absence for just that date)\n**Date Range Example:** `!present Jul 4 Jul 21` (Present from July 4 until July 21 -- removes any absence that matches this start and end date.)',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.AttendanceTools();
		if (args[0] == undefined) {
			message.reply("Sorry, I need a bit more information than that...");
		}
		else {
			absenceDBHelper.present(message, args);
		}
	},
};