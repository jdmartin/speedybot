const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('corkboard')
        .setDescription('What\'s the link and code?'),
    async execute(interaction) {
        require("dotenv").config();
        let response = `The corkboard is here: https://velocitycorkboard.com, and the password is: **${process.env.CORKBOARD_PASS}**\n`;
		interaction.reply({content: response, ephemeral: true});
    }
};