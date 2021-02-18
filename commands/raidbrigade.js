module.exports = {
	name: 'raidbrigade',
	description: 'What\'s the code?',
	execute(message, args) {
        require("dotenv").config();
		message.reply(`Here's the code for the in-game Raid Brigade channel: **${process.env.raidbrigcode}**\nNot sure how to use it? See this: https://worldofwarcraft.com/en-us/invite/K9P9EZpT39q?region=US&faction=Alliance`);
	},
};