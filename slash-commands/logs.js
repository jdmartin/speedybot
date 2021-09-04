const {
	SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('Replies with the guild\'s raiding logs.'),
	async execute(interaction) {
		return interaction.reply('Our logs are here: https://www.warcraftlogs.com/guild/reports-list/41907/');
	},
};