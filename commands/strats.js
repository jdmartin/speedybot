module.exports = {
    name: 'strats',
    description: 'Get all the links to strats for the current raid, or for an older raid.',
    usage: '[optional raid name]',
    notes: 'Right now, the only optional name is: nathria',
    execute(message, args) {
        const {
            MessageEmbed
        } = require("discord.js");
        const sanctum = new MessageEmbed()
            .setTitle("Evie's Strats!")
            .setColor(0xFFFFFF)
            .setAuthor("🏹")
            .setDescription("__Sanctum of Domination__")
            .setFooter("SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...")
            .addFields({
                name: "Bosses",
                value: "[The Tarragrue](https://discord.com/channels/308622057707536385/308626596623810562/861108078976172072)\n[Eye of the Jailer](https://discord.com/channels/308622057707536385/308626596623810562/861108185917161473)\n[The Nine](https://discord.com/channels/308622057707536385/308626596623810562/861108293966495747)\n[Ner'zhul](https://discord.com/channels/308622057707536385/308626596623810562/861108398400471060)\n[Soulrender Dormazain](https://discord.com/channels/308622057707536385/308626596623810562/861748064217858109)\n[Painsmith](https://discord.com/channels/308622057707536385/308626596623810562/862858655089819659)\n[Fatescribe](https://discord.com/channels/308622057707536385/308626596623810562/865345466396966932)\n[Guardian](https://discord.com/channels/308622057707536385/308626596623810562/865354245535301662)\n[Kel'Thuzad](https://discord.com/channels/308622057707536385/308626596623810562/878071037298880542)",
                inline: true
            })
            .addFields({
                name: "Sylvanas",
                value: "[Phase One](https://discord.com/channels/308622057707536385/308626596623810562/878071137840554004)\n[Phase Two](https://discord.com/channels/308622057707536385/308626596623810562/878071205238808587)\n[Phase Three](https://discord.com/channels/308622057707536385/308626596623810562/878071279859687476)",
                inline: true
            })
            .addFields({
                name: "Notes:",
                value: "[Dormazain](https://discord.com/channels/308622057707536385/308626596623810562/900823247287902309)\n[Sylvanas Swirlys](https://discord.com/channels/308622057707536385/308626596623810562/893341077585670176)\n\nWant Nathria? Use `!strats nathria`",
                inline: true
            })
        const nathria = new MessageEmbed()
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
            message.channel.send({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [sanctum]
            });
        } else if (args[0].toLowerCase() === 'nathria') {
            message.channel.send({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [nathria]
            });
        }
    },
};