const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('next')
        .setDescription('What are we doing?'),
    async execute(interaction) {
        const {
            Embed
        } = require("@discordjs/builders");
        const embed = new Embed()
            .setTitle("Evie's Announcements!")
            .setColor(0xFFFFFF)
            .setAuthor({name: "🐢"})
            .setFooter({text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed..." })
            .addFields({
                name: "Immediate",
                value: "[Posted July 6](https://discord.com/channels/308622057707536385/308625441546043402/862183558839533579)\n",
                inline: false
            })
            .addFields({
                name: "Planning",
                value: "[The Burning Reconquista](https://discord.com/channels/308622057707536385/308625441546043402/839871852045664337)\n",
                inline: false
            })
            .addFields({
                name: "Reminders",
                value: "Don't forget to check the #annoucements channel for more stuff!\n",
                inline: false
            })
            interaction.reply({content:"It\'s dangerous to go alone!  Take these:\n\n(If you don\'t see anything, try `!simplenext` or `!speedyhelp`).", embeds: [embed], ephemeral: true});
    },
};