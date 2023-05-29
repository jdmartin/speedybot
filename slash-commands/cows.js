const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const speedyutils = require("../utils/speedyutils");
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
    data: new SlashCommandBuilder().setName("cows").setDescription("Moooooooooo!"),
    async execute(interaction) {
        var fs = require("fs");
        var files = fs.readdirSync("resources/images/cows/");
        let chosenFile = files[getRandomIntInclusive(0, files.length - 1)];
        const file = new AttachmentBuilder(`resources/images/cows/${chosenFile}`);
        interaction.reply({
            content: "Moooooooo:",
            files: [file],
        });
    },
};
