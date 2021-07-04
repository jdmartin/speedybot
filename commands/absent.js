module.exports = {
	name: 'absent',
	description: 'Declare an absence from raid',
	execute(message, args) {
        const absencedb = require("./db/absencedb.js");
        const absenceDBHelper = new absencedb.DatabaseTools();
        absenceDBHelper.test();
	},
};