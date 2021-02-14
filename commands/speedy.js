module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    execute(message, args) {
        const fs = require('fs');
        var textFile = fs.readFileSync('resources/speedy.txt', {
            "encoding": "utf-8"
        });
        message.reply(`
            Hello!  I can help by telling you stuff. Here are some things I can do:\n
            All commands start with a **!**\n
            **adventure**: Want a real Adventure?
            **logs**: Want the link to the logs?\n
            **miniwheat**: Why not flip a mini-wheat?\n
            **speedy**: Displays this help message.\n
            **speedysource**: View my source code.\n\n
            Want something else? Ask Doolan. ~~ 🐢
        `)
    },
};