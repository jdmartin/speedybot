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
        **absent**: Let us know you won't be raiding. (Example: !absent 2021-07-04 Comment)
        **late**: Let us know you're running late. (Example: !late 2021-07-04 Comment)
        **ontime**: Cancels late. (Example: !ontime 2021-07-04)
        **present**: Cancel an absence. (Example: !present 2021-07-04)\n
        Some examples which work with either **absent**, **late**, **ontime**, or **present**:
        (N.B. Comments in !absent and !late can have spaces. Also, you can use commas or not, and you can use three-letter months or the whole word.)
        !absent July 4, 2021 (Absent on July 4, 2021)
        !absent Jul 6 2021 Jul 13 2021 (Absent from July 6 until July 13, 2021)
        !late July 4 2021 (Late on July 4, 2021)
        !ontime Jul 4, 2021 (On-time on July 4, 2021 -- removes the late for that date)
        !present July 4, 2021 (Present on July 4, 2021 -- removes an absence for just that date)
        !present Jul 6 2021 July 13 2021 (Present from July 6 until July 13, 2021 -- removes that range of absences)\n
        Want something else? Ask Doolan. ~~ 🐢
    `)

        if (message.channel.type === 'dm') {
            message.reply(response)
        } else {
            message.member.send(response)
        }
    },
};