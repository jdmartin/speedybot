module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    execute(message, args) {
        if (message.channel.type === 'dm') {
            message.reply(`Hello!  Here are some things I can do (commands work here or in chat):\n
            __Remember: All commands start with a **!**__\n
            **adventure**: Want a real Adventure?
            **logs**: Want the link to the logs?
            **miniwheat**: Why not flip a mini-wheat?
            **rules**: Read the Raid Rules!
            **speedysource**: View my source code.\n
            Want something else? Ask Doolan. ~~ 🐢
        `)},
        if (message.channel.type !== 'dm') {
        message.send(`Hello!  Here are some things I can do (commands work here or in chat):\n
        __Remember: All commands start with a **!**__\n
        **adventure**: Want a real Adventure?
        **logs**: Want the link to the logs?
        **miniwheat**: Why not flip a mini-wheat?
        **rules**: Read the Raid Rules!
        **speedysource**: View my source code.\n
        Want something else? Ask Doolan. ~~ 🐢
    `)
        }
    },
};