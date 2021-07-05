module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    execute(message, args) {
        const response = (`Hello!  Here are some things I can do (commands work here or in chat):\n
        __Remember: All commands start with a **!**__\n
        **adventure**: Want a real Adventure?
        **askspeedy**: Need a *guaranteed* helpful answer? Ask away.
        **cats**: Need a cat right now? Let's get one from the Internet...
        **dogs**: We've got 'em!  You can also use '!dog corgi' to get a corgi.
        **foxes**: How about a fox instead? To the Internet!
        **logs**: Want the link to the logs?
        **miniwheat**: Why not flip a mini-wheat?
        **next**: What are we doing?
        **raidbrigade**: Need the code for the in-game channel?
        **rules**: Read the Raid Rules!
        **sheep**: Need CC? Speedy's got you.
        **speedysource**: View my source code.
        **strats**: Did you read the strat?
        **xkcd**: Read a random comic and feel better...\n
        __Attendance-related Commands__:
        **absences**: See known absences.
        **absent**: Let us know you won't be raiding. (Example: !absent 2021-07-04)
        **present**: Cancel an absence. (Example: !present 2021-07-04)\n
        Some examples which work with either **absent** or **present**:
        !absent 2021-07-04 (Absent on July 4, 2021)
        !absent 2021-07-06 2021-07-13 (Absent from July 6 until July 13, 2021)
        !present 2021-07-04 (Present on July 4, 2021 -- removes an absence for just that date)
        !present 2021-07-06 2021-07-13 (Present from July 6 until July 13, 2021 -- removes that range of absences)\n
        Want something else? Ask Doolan. ~~ 🐢
    `)

        if (message.channel.type === 'dm') {
            message.reply(response)
        } else {
            message.member.send(response)
        }
    },
};