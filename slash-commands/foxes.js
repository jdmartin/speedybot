const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('foxes')
        .setDescription('See a random fox!'),
    async execute(interaction) {
        const fetch = require('node-fetch');
        (async function () {
            const {
                image
            } = await fetch('https://randomfox.ca/floof/').then(response => response.json());
            interaction.reply(image);
        })();
    },
};