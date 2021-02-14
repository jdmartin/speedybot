module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    execute(message, args) {
        const fs = require('fs');
        var textFile = fs.readFileSync('resources/speedy.txt', {
            "encoding": "utf-8"
        });
        message.reply(`
        Hello!  I can help by telling you stuff.\n
        Here are some things I can do:\n
        !adventure:\t\tWant a real Adventure?\n
        !logs:\t\tWant the link to the logs?\n
        !miniwheat:\t\tWhy not flip a mini-wheat?\n
        !speedysource:\t\tView my source code.\n\n
        Want something else? Ask Doolan.\n
        ~ 🐢`);
    },
};