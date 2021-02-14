module.exports = {
	name: 'logs',
	description: 'Get the Logs!',
	execute(message, args) {
		message.reply(`Our logs are here: https://www.warcraftlogs.com/guild/reports-list/41907/`);
	},
};