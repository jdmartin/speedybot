module.exports = {
	name: 'logs',
	description: 'Get the Logs!',
	aliases: ['log'],
	usage: '',
	notes: '',
	execute(message) {
		message.channel.send(`Our logs are here: https://www.warcraftlogs.com/guild/reports-list/41907/`);
	},
};