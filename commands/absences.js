module.exports = {
	name: 'absences',
	description: 'Show absences',
	usage: '',
	notes: 'Shows you known absences, and declared lateness, with their comments in a concise format.',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataDisplayTools();
        absenceDBHelper.show(message, args);
	},
};