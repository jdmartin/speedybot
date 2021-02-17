module.exports = {
    name: 'xyzzy',
    description: 'Did you read the strat?',
    execute(message, args) {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setTitle("Evie's Strats!")
            .setColor(0xFFFFFF)
            .setAuthor("", "https://cdn.discordapp.com/avatars/810395362761375765/041521ca9f7dac6aabbb909f4091f98b.png")
            .setDescription("__Castle Nathria__\n[Shriekwing](https://discord.com/channels/308622057707536385/308626596623810562/793739928093065236)\n[Huntsman](https://discord.com/channels/308622057707536385/308626596623810562/793740029323247646)\n[Devourer](https://discord.com/channels/308622057707536385/308626596623810562/793740126454284328)\n[Xy'Mox](https://discord.com/channels/308622057707536385/308626596623810562/795513357817479219)\n[Darkvein](https://discord.com/channels/308622057707536385/308626596623810562/796565645612285972)\n[Sun King](https://discord.com/channels/308622057707536385/308626596623810562/796099898201341952)\n[Council](https://discord.com/channels/308622057707536385/308626596623810562/796831060709081160)\n[Sludgefist](https://discord.com/channels/308622057707536385/308626596623810562/797714826297344070)\n[Stone Legion](https://discord.com/channels/308622057707536385/308626596623810562/797999175044038656)\n__Denathrius__\n[Phase 1](https://discord.com/channels/308622057707536385/308626596623810562/799400259205464075)\n[Phase 2](https://discord.com/channels/308622057707536385/308626596623810562/799412289530626058)\n[Phase 3](https://discord.com/channels/308622057707536385/308626596623810562/799452523735023646)");

        message.reply(`Hello!  Here are links to Evie's raid strats:\n`);
        message.channel.send(embed);
        
    },
};