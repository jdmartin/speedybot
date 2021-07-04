module.exports = {
	name: 'absences',
	description: 'Show absences',
	execute(message, args) {
        const absencedb = require("../db/absencedb.js");
        const absenceDBHelper = new absencedb.DatabaseTools();
        const absences = absenceDBHelper.show();

        if (message.channel.type === 'dm') {
            message.reply(absences)
        } else {
            message.member.send(absences)
        }
	},
};