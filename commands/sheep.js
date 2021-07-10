module.exports = {
	name: 'sheep',
	description: 'CC!',
	usage: '',
	notes: '',
	execute(message, args) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/sheep/');
		let chosenFile = files[Math.floor(Math.random() * files.length)];
		message.reply("+1 sheep:", {files: [`resources/images/sheep/${chosenFile}`]});
	},
};