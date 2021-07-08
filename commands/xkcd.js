module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    notes: 'Comics from https://xkcd.com/',
    execute(message, args) {
        const fetch = require('node-fetch');

        (async function () {
            const {
                num
            } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());

            const choice = Math.round(Math.random() * (num - 1) + 1);
            
            message.reply(`Here's a random comic from xkcd.com: https://xkcd.com/${choice}/\n`); 
        })();
    },
};