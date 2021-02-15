module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    guildOnly: true,
    execute(message, args) {
        message.member.send(`Hello!  Here are some things I can do (commands work here or in chat):\n
            __Remember: All commands start with a **!**__\n
            **adventure**: Want a real Adventure?
            **askspeedy**: Need a *guaranteed* helpful answer? Ask away.
            **logs**: Want the link to the logs?
            **miniwheat**: Why not flip a mini-wheat?
            **rules**: Read the Raid Rules!
            **speedysource**: View my source code.\n
            Want something else? Ask Doolan. ~~ 🐢
        `)
    },
};