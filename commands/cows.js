const speedyutils = require('../utils/speedyutils');
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
	name: 'cows',
	description: 'Moo!',
	usage: '',
	notes: '',
	execute(message) {
		var fs = require('fs');
		var files = fs.readdirSync('resources/images/cows/');
		let chosenFile = files[getRandomIntInclusive(0, files.length - 1)];
		message.reply({
			content: "Moooooooo:",
			files: [`resources/images/cows/${chosenFile}`]
		});
	},
};