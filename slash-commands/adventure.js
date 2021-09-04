const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adventure')
        .setDescription('Link to an Adventure that is close to Speedy\'s heart'),
    async execute(interaction) {
        return interaction.reply({
            content: `This adventure, Speedy craves: https://quuxplusone.github.io/Advent/index.html`,
            ephemeral: false
        });
    },
};