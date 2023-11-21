const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("adventure")
        .setDescription("Link to an Adventure that is close to Speedy's heart"),
    async execute(interaction) {
        return interaction.reply({
            content: `This adventure, Speedy craves: https://dungeo.org/ (Hint: Turn on the map!)\n\nThis version is also awesome: https://quuxplusone.github.io/Advent/index.html.`,
            ephemeral: true,
        });
    },
};
