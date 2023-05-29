const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sourcecode")
        .setDescription("See the source code that started an Internet sensa... well, a thing on the Internet!"),
    async execute(interaction) {
        let response = `My source code is here: https://github.com/jdmartin/speedybot\nThis is the latest release: https://github.com/jdmartin/speedybot/releases/latest/`;
        interaction.reply({ content: response, ephemeral: true });
    },
};
