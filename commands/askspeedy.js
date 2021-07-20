const utils = require("../utils/speedyutils.js");
const speedyutils = new utils.SpeedyTools();
const shuffleArray = speedyutils.shuffleArray;

module.exports = {
	name: 'askspeedy',
	description: 'Get a guaranteed quality answer to life\'s mysteries',
	usage: '',
	notes: '',
	execute(message, args) {
		let divinations = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes – definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."]
        message.reply(`**${shuffleArray(divinations)[0]}**`);
	},
};