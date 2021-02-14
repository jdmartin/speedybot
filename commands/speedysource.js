module.exports = {
	name: 'speedysource',
	cooldown: 10,
	description: 'See my source code!',
	execute(message, args) {
		message.reply(`My source code is here: https://github.com/jdmartin/speedybot`);
	},
};