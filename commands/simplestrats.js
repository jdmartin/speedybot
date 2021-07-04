module.exports = {
    name: 'simplestrats',
    description: 'Did you read the strat?',
    execute(message, args) {
        const sanctum = (`Hello! Here are links to Evie's raid strats:\n
        __Sanctum of Domination__\n
        **The Tarragrue**: https://discord.com/channels/308622057707536385/308626596623810562/861108078976172072
        **Eye of the Jailer**: https://discord.com/channels/308622057707536385/308626596623810562/861108185917161473
        **The Nine**: https://discord.com/channels/308622057707536385/308626596623810562/861108293966495747
        **Ner'zhul**: https://discord.com/channels/308622057707536385/308626596623810562/861108398400471060
        
        
        Want Nathria? Try !simplestrats nathria
        🐢
    `)
        const nathria = (`Hello!  Here are links to Evie's raid strats:\n
        __Castle Nathria__\n
        **Shriekwing**: https://discord.com/channels/308622057707536385/308626596623810562/793739928093065236
        **Huntsman**: https://discord.com/channels/308622057707536385/308626596623810562/793740029323247646
        **Destroyer**: https://discord.com/channels/308622057707536385/308626596623810562/793740126454284328
        **Xy'Mox**: https://discord.com/channels/308622057707536385/308626596623810562/795513357817479219
        **Darkvein**: https://discord.com/channels/308622057707536385/308626596623810562/796565645612285972
        **Sun King**: https://discord.com/channels/308622057707536385/308626596623810562/796099898201341952
        **Council**: https://discord.com/channels/308622057707536385/308626596623810562/796831060709081160
        **Sludgefist**: https://discord.com/channels/308622057707536385/308626596623810562/797714826297344070
        **Stone Legion**: https://discord.com/channels/308622057707536385/308626596623810562/797999175044038656
        __Denathrius__
        **Phase 1**: https://discord.com/channels/308622057707536385/308626596623810562/799400259205464075
        **Phase 2**: https://discord.com/channels/308622057707536385/308626596623810562/799412289530626058
        **Phase 3**: https://discord.com/channels/308622057707536385/308626596623810562/799452523735023646\n
        __Heroic__
        **Shriekwing**: https://discord.com/channels/308622057707536385/308626596623810562/821981070320861184
        **Huntsman**: https://discord.com/channels/308622057707536385/308626596623810562/821981177593331713
        **Destroyer**: https://discord.com/channels/308622057707536385/308626596623810562/821981301858631680
        **Darkvein**: https://discord.com/channels/308622057707536385/308626596623810562/821981414957514753 
        **Xy'Mox**: https://discord.com/channels/308622057707536385/308626596623810562/821981523372539954
        🐢
    `)
        
        if (!args.length) {
            if (message.channel.type === 'dm') {
                message.reply(sanctum)
            } else {
                message.member.send(sanctum)
            }
        } else if (args[0].toLowerCase() === 'nathria') {
            if (message.channel.type === 'dm') {
                message.reply(nathria)
            } else {
                message.member.send(nathria)
            }
        }
        
    },
};