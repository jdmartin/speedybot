const utils = require("../utils/speedyutils.js");
const speedyutils = new utils.SpeedyTools();
const shuffleArray = speedyutils.shuffleArray;

module.exports = {
	name: 'sheep',
	description: 'CC!',
	usage: '',
	notes: '',
	execute(message, args) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/sheep/');
		let chosenFile = shuffleArray(files)[0];
		message.reply("+1 sheep:", {files: [`resources/images/sheep/${chosenFile}`]});
	},
};