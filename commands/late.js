module.exports = {
	name: 'late',
	description: 'Let us know you will be late to raid!',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DatabaseTools();
		absenceDBHelper.tardy(message, args);
	},
};