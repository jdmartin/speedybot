const { SlashCommandBuilder } = require("discord.js");
const speedydb = require("../utils/speedydb.js");
const speedyStats = new speedydb.GetStats();

module.exports = {
    data: new SlashCommandBuilder().setName("xyzzy").setDescription("Get command usage stats (resets when Speedy does)."),
    async execute(interaction) {
        let response = speedyStats.retrieve();
        interaction.reply({ embeds: [response.slashEmbed], ephemeral: true });
    },
};
