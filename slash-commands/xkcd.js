const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xkcd')
        .setDescription('Get a random xkcd comic!'),
    async execute(interaction) {
        const fetch = require('node-fetch');

        (async function () {
            const {
                num
            } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());

            const choice = Math.round(Math.random() * (num - 1) + 1);
            
            interaction.reply(`Here's a random comic from xkcd.com: https://xkcd.com/${choice}/\n`); 
        })();
    },
};