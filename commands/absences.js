module.exports = {
	name: 'absences',
	description: 'Show absences',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataDisplayTools();
        absenceDBHelper.show(message);
	},
};