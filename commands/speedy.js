module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    execute(message, args) {
        const fs = require('fs');
        var textFile = fs.readFileSync('resources/speedy.txt', {"encoding": "utf-8"});
        message.channel.send(textFile)
        //message.reply(`Hello!  I can help by telling you stuff. Here are some things I can do:\n\n Want the link to the logs? Type !logs\n Want a real Adventure? Type !adventure\n Why not flip a mini-wheat? Type !miniwheat\n Want something else? Ask Doolan.`);
    },
};