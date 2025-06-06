const { EmbedBuilder, MessageFlags, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("next").setDescription("What are we doing?"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Evie's Announcements!")
            .setColor(0xffffff)
            .setAuthor({
                name: "🐢",
            })
            .setFooter({
                text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
            })
            .addFields({
                name: "Immediate",
                value: "[Posted Dec 31](https://discord.com/channels/308622057707536385/308625441546043402/926545217849557003)\n",
                inline: false,
            })
            .addFields({
                name: "Planning",
                value: "[The Burning Reconquista](https://discord.com/channels/308622057707536385/308625441546043402/839871852045664337)\n",
                inline: false,
            })
            .addFields({
                name: "Reminders",
                value: "Don't forget to check the #annoucements channel for more stuff!\n",
                inline: false,
            });
        interaction.reply({
            content: "It's dangerous to go alone!  Take these:\n",
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    },
};
