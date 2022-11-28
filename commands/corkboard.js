const {
    ChannelType
} = require("discord.js");

module.exports = {
	name: 'corkboard',
	description: 'What\'s the link and code?',
	usage: '',
	notes: '',
	execute(message) {
        require("dotenv").config();
        const response = `The corkboard is here: https://velocitycorkboard.com, and the password is: **${process.env.CORKBOARD_PASS}**\n`;
        if (message.channel.type === ChannelType.DM) {
            message.channel.send(response)
        } else {
            message.member.send(response)
        }
	},
};