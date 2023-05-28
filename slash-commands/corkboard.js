const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("corkboard").setDescription("What's the link and code?"),
    async execute(interaction) {
        require("dotenv").config();
        const button = new ButtonBuilder()
            .setLabel("Visit the Corkboard")
            .setURL("https://velocitycorkboard.com")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);
        let response = `The corkboard is here: https://velocitycorkboard.com, and the password is: **${process.env.CORKBOARD_PASS}**\n\n`;
        interaction.reply({ content: response, components: [row], ephemeral: true });
    },
};
