const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strats')
        .setDescription('Get all the links to strats for the current raid, or for an older raid.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('sepulchre')
                .setDescription('Strats for Sepulchre of the First Ones'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('sanctum')
                .setDescription('Strats for Sanctum of Domination'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nathria')
                .setDescription('Strats for Castle Nathria')),
    async execute(interaction) {
        const Shadowlands =  require('../resources/strats/shadowlands.js');

        if (interaction.options.getSubcommand().toLowerCase() === 'sanctum') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Shadowlands.sanctum], ephemeral: true});
        } else if (interaction.options.getSubcommand().toLowerCase() === 'nathria') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Shadowlands.nathria], ephemeral: true});
        } else if (interaction.options.getSubcommand().toLowerCase() === 'sepulchre') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Shadowlands.sepulchre], ephemeral: true});
        }
    },
};