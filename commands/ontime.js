module.exports = {
	name: 'ontime',
	description: 'Tell us you will not be late to raid!',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataEntryTools();
		absenceDBHelper.ontime(message, args);
	},
};