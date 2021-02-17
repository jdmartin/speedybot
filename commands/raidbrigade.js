module.exports = {
	name: 'raidbrigade',
	description: 'What\'s the code?',
	execute(message, args) {
        const config = require("../config.json");
		message.reply(`Here's the code for the in-game Raid Brigade channel: **${config.raidbrigcode}**\nNot sure how to use it? See this: https://worldofwarcraft.com/en-us/invite/K9P9EZpT39q?region=US&faction=Alliance`);
	},
};