const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const speedyutils = require('../utils/speedyutils');
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cows')
        .setDescription('Moooooooooo!'),
    async execute(interaction) {
        var fs = require('fs');
        var files = fs.readdirSync('resources/images/cows/');
        let chosenFile = files[getRandomIntInclusive(0, files.length - 1)];
        interaction.reply({
            content: "Moooooooo:",
            files: [`resources/images/cows/${chosenFile}`]
        });
    }
};