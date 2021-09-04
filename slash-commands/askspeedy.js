const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const speedyutils = require('../utils/speedyutils');
const utils = new speedyutils.SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('askspeedy')
		.setDescription('Get a guaranteed quality answer to life\'s mysteries'),
	async execute(interaction) {
        let divinations = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes – definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
		return interaction.reply(`**${divinations[getRandomIntInclusive(0,divinations.length - 1)]}**`);
	},
};