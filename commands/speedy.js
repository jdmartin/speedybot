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
        **raidbrigade**: Need the code for the in-game channel?
        **rules**: Read the Raid Rules!
        **speedysource**: View my source code.
        **strats**: Did you read the strat?
        **xkcd**: Read a random comic and feel better...\n
        Want something else? Ask Doolan. ~~ 🐢
    `)

        if (message.channel.type === 'dm') {
            message.reply(response)
        } else {
            message.member.send(response)
        }
    },
};