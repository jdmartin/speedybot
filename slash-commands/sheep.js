const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const speedyutils = require('../utils/speedyutils');
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sheep')
        .setDescription('CC!'),
    async execute(interaction) {
        var fs = require('fs');
		var files = fs.readdirSync('resources/images/sheep/');
		let chosenFile = files[getRandomIntInclusive(0, files.length - 1)];
		interaction.reply({
			content: "+1 sheep:",
			files: [`resources/images/sheep/${chosenFile}`]
		});
    },
};