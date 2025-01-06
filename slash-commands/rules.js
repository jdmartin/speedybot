const { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("rules").setDescription("Rules for Raiding!"),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setLabel("Visit the Corkboard")
            .setURL("https://velocitycorkboard.com")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);

        const file = new AttachmentBuilder("./resources/images/rules.png");

        interaction.reply({
            content: "Here are the raid rules. You can also see the latest version on the Corkboard!",
            files: [file],
            components: [row],
            flags: MessageFlags.Ephemeral,
        });
    },
};
