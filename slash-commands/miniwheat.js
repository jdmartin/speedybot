const { SlashCommandBuilder } = require("discord.js");
const speedyutils = require("../utils/speedyutils");
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
    data: new SlashCommandBuilder().setName("miniwheat").setDescription("Flip a Mini-Wheat!"),
    async execute(interaction) {
        let outcomes = ["frosted", "plain"];
        interaction.reply(
            `Your mini-wheat lands on the **${outcomes[getRandomIntInclusive(0, outcomes.length - 1)]}** side!`,
        );
    },
};
