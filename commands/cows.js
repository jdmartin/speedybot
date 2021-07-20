import speedyutils from '../utils/speedyutils';
const shuffleArray = speedyutils.shuffleArray;

module.exports = {
	name: 'cows',
	description: 'Moo!',
	usage: '',
	notes: '',
	execute(message, args) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/cows/');
		let chosenFile = shuffleArray(files)[0];
		message.reply("Moooooooo:", {files: [`resources/images/cows/${chosenFile}`]});
	},
};