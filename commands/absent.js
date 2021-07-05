module.exports = {
	name: 'absent',
	description: 'Tell us you will miss raid!',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DatabaseTools();
		absenceDBHelper.addAbsence(message, args);
	},
};