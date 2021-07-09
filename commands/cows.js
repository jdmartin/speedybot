module.exports = {
	name: 'cows',
	description: 'Moo!',
	execute(message, args) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/cows/');
		let chosenFile = files[Math.floor(Math.random() * files.length)];
		message.reply("+1 sheep:", {files: [`resources/images/cows/${chosenFile}`]});
	},
};