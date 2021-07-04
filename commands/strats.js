module.exports = {
    name: 'strats',
    description: 'Did you read the strat?',
    execute(message, args) {
        const Discord = require("discord.js");
        const sanctum = new Discord.MessageEmbed()
            .setTitle("Evie's Strats!")
            .setColor(0xFFFFFF)
            .setAuthor("🏹")
            .setDescription("__Sanctum of Domination__")
            .setFooter("SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...")
            .addFields({
                name: "Bosses",
                value: "[The Tarragrue](https://discord.com/channels/308622057707536385/308626596623810562/861108078976172072)\n[Eye of the Jailer](https://discord.com/channels/308622057707536385/308626596623810562/861108185917161473)\n[The Nine](https://discord.com/channels/308622057707536385/308626596623810562/861108293966495747)\n[Ner'zhul](https://discord.com/channels/308622057707536385/308626596623810562/861108398400471060)\nWant Nathria? Use `!strats nathria`",
                inline: true
            })
        const nathria = new Discord.MessageEmbed()
            .setTitle("Evie's Strats!")
            .setColor(0xFFFFFF)
            .setAuthor("🧛‍♀️")
            .setDescription("__Castle Nathria__")
            .setFooter("SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...")
            .addFields({
                name: "Bosses",
                value: "[Shriekwing](https://discord.com/channels/308622057707536385/308626596623810562/793739928093065236)\n[Huntsman](https://discord.com/channels/308622057707536385/308626596623810562/793740029323247646)\n[Destroyer](https://discord.com/channels/308622057707536385/308626596623810562/793740126454284328)\n[Darkvein](https://discord.com/channels/308622057707536385/308626596623810562/796565645612285972)\n[Xy'Mox](https://discord.com/channels/308622057707536385/308626596623810562/795513357817479219)",
                inline: true
            })
            .addFields({
                name: "Even More Bosses",
                value: "[Sun King](https://discord.com/channels/308622057707536385/308626596623810562/796099898201341952)\n[Council](https://discord.com/channels/308622057707536385/308626596623810562/796831060709081160)\n[Sludgefist](https://discord.com/channels/308622057707536385/308626596623810562/797714826297344070)\n[Stone Legion](https://discord.com/channels/308622057707536385/308626596623810562/797999175044038656)",
                inline: true
            })
            .addFields({
                name: "Denathrius",
                value: "[Phase 1](https://discord.com/channels/308622057707536385/308626596623810562/799400259205464075)\n[Phase 2](https://discord.com/channels/308622057707536385/308626596623810562/799412289530626058)\n[Phase 3](https://discord.com/channels/308622057707536385/308626596623810562/799452523735023646)",
                inline: true
            })
            .addFields({
                name: "Heroic",
                value: "[Shriekwing](https://discord.com/channels/308622057707536385/308626596623810562/821981070320861184)\n[Huntsman](https://discord.com/channels/308622057707536385/308626596623810562/821981177593331713)\n[Destroyer](https://discord.com/channels/308622057707536385/308626596623810562/821981301858631680)\n[Darkvein](https://discord.com/channels/308622057707536385/308626596623810562/821981414957514753)\n[Xy'Mox](https://discord.com/channels/308622057707536385/308626596623810562/821981523372539954)"
            })
        if (!args.length) {
            if (message.channel.type === 'dm') {
                message.reply(`It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try !simplestrats or !speedyhelp.)`);
                message.channel.send(sanctum);
            } else {
                message.member.send(`It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try !simplestrats or !speedyhelp.)`);
                message.member.send(sanctum);
            }
        } else if (args[0].toLowerCase() === 'nathria') {
            if (message.channel.type === 'dm') {
                message.reply(`It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try !simplestrats or !speedyhelp.)`);
                message.channel.send(nathria);
            } else {
                message.member.send(`It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try !simplestrats or !speedyhelp.)`);
                message.member.send(nathria);
            }
        }
    },
};