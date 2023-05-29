const { SlashCommandBuilder } = require("discord.js");

const xmas = require("../db/xmasdb.js");
const xmasDBHelper = new xmas.XmasDisplayTools();

module.exports = {
    data: new SlashCommandBuilder().setName("elves").setDescription("Show a list of friendly elves."),

    async execute(interaction) {
        let response = xmasDBHelper.show();
        let stats = xmasDBHelper.stats();
        interaction.reply({ embeds: [response, stats], ephemeral: true });
    },
};
