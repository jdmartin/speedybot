const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("raidbrigade").setDescription("What's the code?"),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setLabel("Visit the Invitation Page")
            .setURL("https://worldofwarcraft.com/en-us/invite/K9P9EZpT39q?region=US&faction=Alliance")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);
        require("dotenv").config();
        interaction.reply({
            content: `Here's the code for the in-game Raid Brigade channel: **${process.env.raidbrigcode}**\n\nNot sure how to use it? Click the button! \n\n`,
            components: [row],
        });
    },
};
