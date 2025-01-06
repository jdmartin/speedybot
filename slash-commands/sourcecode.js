const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sourcecode")
        .setDescription("See the source code that started an Internet sensa... well, a thing on the Internet!"),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setLabel("See the latest release")
            .setURL("https://github.com/jdmartin/speedybot/releases/latest/")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);
        let response = `My source code is here: https://github.com/jdmartin/speedybot\n\n`;
        interaction.reply({ content: response, components: [row], flags: MessageFlags.Ephemeral });
    },
};
