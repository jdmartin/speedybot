module.exports = {
	name: 'raidbrigade',
	description: 'What\'s the code?',
	usage: '',
	notes: '',
	execute(message) {
        require("dotenv").config();
		message.channel.send(`Here's the code for the in-game Raid Brigade channel: **${process.env.raidbrigcode}**\nNot sure how to use it? See this: https://worldofwarcraft.com/en-us/invite/K9P9EZpT39q?region=US&faction=Alliance`);
	},
};