const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strats')
        .setDescription('Get all the links to strats for the current raid, or for an older raid.')
        .addStringOption(option => 
            option.setName('raid_name')
            .setDescription('Name of the Raid')
            .setRequired(true)
            .addChoices(
                {name: 'Sepulchre', value: 'sepulchre'},
                {name: 'Sanctum', value: 'sanctum'},
                {name: 'Nathria', value: 'nathria'},
                {name: 'Vault', value: 'vault'},
            )
        ),

    async execute(interaction) {
        const Shadowlands =  require('../resources/strats/shadowlands.js');
        const Dragonflight = require('../resources/strats/dragonflight.js');

        if (interaction.options.getString('raid_name') === 'sanctum') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Shadowlands.sanctum], ephemeral: true});
        } else if (interaction.options.getString('raid_name') === 'nathria') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Shadowlands.nathria], ephemeral: true});
        } else if (interaction.options.getString('raid_name') === 'sepulchre') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Shadowlands.sepulchre], ephemeral: true});
        } else if (interaction.options.getString('raid_name') === 'vault') {
            interaction.reply({content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)", embeds: [Dragonflight.vault], ephemeral: true});
        }
    },
};