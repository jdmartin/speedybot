module.exports = {
    name: 'next',
    description: 'What are we doing?',
    async execute(message) {
        const {
            MessageEmbed
        } = require('discord.js');
        const embed = new MessageEmbed()
            .setAuthor({
                name: "🐢"
            })
            .setFooter({
                text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed..."
            })
            .setTitle("Evie's Announcements!")
            .setColor(0xFFFFFF)
            //.setDescription("")
            .addFields({
                name: "Immediate",
                value: "[Posted Dec 31](https://discord.com/channels/308622057707536385/308625441546043402/926545217849557003)\n",
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

        if (message.channel.type === 'DM') {
            message.reply({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplenext` or `!speedyhelp`.)",
                embeds: [embed]
            });
        } else {
            message.member.send({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplenext` or `!speedyhelp`.)",
                embeds: [embed]
            });
        }
    }
};