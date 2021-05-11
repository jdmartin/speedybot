module.exports = {
    name: 'next',
    description: 'What are we doing?',
    execute(message, args) {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setTitle("Evie's Announcements!")
            .setColor(0xFFFFFF)
            .setAuthor("🧛‍♀️")
            .setDescription("")
            .setFooter("SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...")
            .addFields({
                name: "Immediate",
                value: "[Posted May 9](https://discord.com/channels/308622057707536385/308625441546043402/841157209764397067)\n",
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

        if (message.channel.type === 'dm') {
            message.reply(`It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try !simplenext or !speedyhelp.)`);
            message.channel.send(embed);
        } else {
            message.member.send(`It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try !simplenext or !speedyhelp.)`);
            message.member.send(embed);
        }
    },
};