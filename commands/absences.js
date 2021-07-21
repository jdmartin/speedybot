module.exports = {
	name: 'absences',
	description: 'Show absences',
	usage: '[option]',
	notes: 'Shows you known absences, and declared lateness, with their comments in a concise format.\nOptionally, you can say `!absences mine` to see just your own absences and declared lateness.',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DataDisplayTools();
        absenceDBHelper.show(message, args);
	},
};