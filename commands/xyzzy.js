module.exports = {
    name: 'xyzzy',
    description: 'Did you read the strat?',
    execute(message, args) {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setTitle("Evie's Strats!")
            .setColor(0xFFFFFF)
            .setAuthor("", "https://cdn.discordapp.com/avatars/810395362761375765/041521ca9f7dac6aabbb909f4091f98b.png")
            .setDescription("__Castle Nathria__\n\n")
            .addFields({name: "Bosses", value: "[Shriekwing](https://discord.com/channels/308622057707536385/308626596623810562/793739928093065236)     [Huntsman](https://discord.com/channels/308622057707536385/308626596623810562/793740029323247646)\n[Devourer](https://discord.com/channels/308622057707536385/308626596623810562/793740126454284328)\n[Xy'Mox](https://discord.com/channels/308622057707536385/308626596623810562/795513357817479219)\n[Darkvein](https://discord.com/channels/308622057707536385/308626596623810562/796565645612285972)\n"})

        message.reply(`It's dangerous to go alone!  Take these:\n`);
        message.channel.send(embed);
        
    },
};