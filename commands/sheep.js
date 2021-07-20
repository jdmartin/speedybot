const speedyutils = require('../utils/speedyutils');
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
	name: 'sheep',
	description: 'CC!',
	usage: '',
	notes: '',
	execute(message, args) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/sheep/');
		let chosenFile = files[getRandomIntInclusive(0,files.length - 1)];
		message.reply("+1 sheep:", {files: [`resources/images/sheep/${chosenFile}`]});
	},
};