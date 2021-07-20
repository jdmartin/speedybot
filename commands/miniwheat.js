const speedyutils = require('../utils/speedyutils');
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
	name: 'miniwheat',
	description: 'Flip a Mini-Wheat!',
	usage: '',
	notes: '',
	execute(message, args) {
		let outcomes = ["frosted", "plain"];
		message.reply(`Your mini-wheat lands on the **${outcomes[getRandomIntInclusive(0,outcomes.length - 1)]}** side!`);
	},
};