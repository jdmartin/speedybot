module.exports = {
    name: 'simplestrats',
    description: 'Get all the links to strats for the current raid, or for an older raid.',
    usage: '[optional raid name]',
    notes: 'Right now, the only optional name is: nathria',
    execute(message, args) {
        const sepulchre = (`Hello!  Here are links to Evie's raid strats:\n
        __Sepulchre of the First Ones__\n
        **Vigilant Guardian**: https://discord.com/channels/308622057707536385/308626596623810562/947960827326115871
        **Skolex**: https://discord.com/channels/308622057707536385/308626596623810562/948029005741850624
        **Xy'Mox, take 2**: https://discord.com/channels/308622057707536385/308626596623810562/955914735956668466
        **Dausegne**: https://discord.com/channels/308622057707536385/308626596623810562/948961279786254447
        **Pantheon**: https://discord.com/channels/308622057707536385/308626596623810562/949042645177622549
        **Lihuvium**: https://discord.com/channels/308622057707536385/308626596623810562/952604140855525527
        **Halondrus**: https://discord.com/channels/308622057707536385/308626596623810562/955979512582135829
        **Anduin**: https://discord.com/channels/308622057707536385/308626596623810562/956592880695271424
        **Rygelon**: https://discord.com/channels/308622057707536385/308626596623810562/966888525184270406
        **Lords of Dread**: https://discord.com/channels/308622057707536385/308626596623810562/969296305472036944
        **The Jailer**: https://discord.com/channels/308622057707536385/308626596623810562/969316069028286474
        
        Something else? Try !simplestrats nathria or !simplestrats sanctum
        🐢
    `)
        const sanctum = (`Hello!  Here are links to Evie's raid strats:\n
        __Sanctum of Domination__\n
        **The Tarragrue**: https://discord.com/channels/308622057707536385/308626596623810562/861108078976172072
        **Eye of the Jailer**: https://discord.com/channels/308622057707536385/308626596623810562/861108185917161473
        **The Nine**: https://discord.com/channels/308622057707536385/308626596623810562/861108293966495747
        **Ner'zhul**: https://discord.com/channels/308622057707536385/308626596623810562/861108398400471060
        **Dormazain**: https://discord.com/channels/308622057707536385/308626596623810562/861748064217858109
        **Painsmith**: https://discord.com/channels/308622057707536385/308626596623810562/862858655089819659
        **Fatescribe**: https://discord.com/channels/308622057707536385/308626596623810562/865345466396966932
        **Guardian**: https://discord.com/channels/308622057707536385/308626596623810562/865354245535301662
        **Kel'Thuzad**: https://discord.com/channels/308622057707536385/308626596623810562/878071037298880542
        __Sylvanas__
        **Phase 1**: https://discord.com/channels/308622057707536385/308626596623810562/878071137840554004
        **Phase 2**: https://discord.com/channels/308622057707536385/308626596623810562/878071205238808587
        **Phase 3**: https://discord.com/channels/308622057707536385/308626596623810562/878071279859687476
        __Notes__
        **Dormazain**: https://discord.com/channels/308622057707536385/308626596623810562/900823247287902309
        **Sylvanas Swirlys**: https://discord.com/channels/308622057707536385/308626596623810562/893341077585670176
        
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
            if (message.channel.type === 'DM') {
                message.channel.send(sepulchre)
            } else {
                message.member.send(sepulchre)
            }
        } else if (args[0].toLowerCase() === 'sanctum') {
            if (message.channel.type === 'DM') {
                message.channel.send(sanctum)
            } else {
                message.member.send(sanctum)
            }
        } 
        else if (args[0].toLowerCase() === 'nathria') {
            if (message.channel.type === 'DM') {
                message.channel.send(nathria)
            } else {
                message.member.send(nathria)
            }
        }

    },
};