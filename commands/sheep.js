module.exports = {
	name: 'sheep',
	description: 'CC!',
	execute(message, args) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/sheep/');
		let chosenFile = files[Math.floor(Math.random() * files.length)];
		message.reply(`${chosenFile}`);
	},
};