const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Rules for Raiding!'),
    async execute(interaction) {
        interaction.reply({
            content: 'Here are the raid rules:',
            files: [
                "./resources/images/rules.png"
            ]
        });
    },
};