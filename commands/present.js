module.exports = {
	name: 'present',
	description: 'Tell us you will not miss raid!',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DatabaseTools();
		absenceDBHelper.addPresent(message, args);
	},
};