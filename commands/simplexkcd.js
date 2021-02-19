module.exports = {
    name: 'simplexkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        const fetch = require('node-fetch');

        (async function () {
            const {
                num
            } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());

            const choice = Math.round(Math.random() * (num - 1) + 1);

            const {
                img
            } = await fetch(`https://xkcd.com/${choice}/info.0.json`).then(response => response.json());
            
            if (message.channel.type === 'dm') {
                message.reply(`Here's a random comic from xkcd.com': (Source: https://xkcd.com/${choice}/)\n`);
                message.channel.send(img);
            } else {
                message.member.send(`Here's a random comic from xkcd.com': (Source: https://xkcd.com/${choice}/)\n`);
                message.member.send(img);
            }
        })();
    },
};