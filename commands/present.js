module.exports = {
	name: 'present',
	description: 'Tell us you will not miss raid!',
	usage: '[Month Day]',
	notes: 'Examples:\n!present July 4 (Present on July 4 -- removes an absence for just that date)\n!present Jul 4 Jul 21 (Present from July 4 until July 21 -- removes any absence that matches this start and end date.',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataEntryTools();
		absenceDBHelper.present(message, args);
	},
};