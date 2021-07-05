module.exports = {
	name: 'absent',
	description: 'Tell us you will miss raid!',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataEntryTools();
		absenceDBHelper.addAbsence(message, args);
	},
};