const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raidbrigade')
        .setDescription('What\'s the code?'),
    async execute(interaction) {
        require("dotenv").config();
		interaction.reply(`Here's the code for the in-game Raid Brigade channel: **${process.env.raidbrigcode}**\nNot sure how to use it? See this: https://worldofwarcraft.com/en-us/invite/K9P9EZpT39q?region=US&faction=Alliance`);
    },
};