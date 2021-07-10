module.exports = {
	name: 'speedysource',
	description: 'See my source code!',
	usage: '',
	notes: '',
	execute(message, args) {
		const response = (`My source code is here: https://github.com/jdmartin/speedybot\nThis is the latest release: https://github.com/jdmartin/speedybot/releases/latest/`)
		message.reply(response);
	},
};