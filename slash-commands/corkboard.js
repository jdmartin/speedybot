const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("corkboard").setDescription("What's the link and code?"),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setLabel("Visit the Corkboard")
            .setURL("https://velocitycorkboard.com")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);
        let response = `The password is: "**${process.env.CORKBOARD_PASS}**"\n\n`;
        interaction.reply({ content: response, components: [row], flags: MessageFlags.Ephemeral });
    },
};
