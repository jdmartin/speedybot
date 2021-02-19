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
            
            if (message.channel.type === 'dm') {
                message.reply("Here's a random comic from xkcd.com':\n)");
                message.channel.send(`https://xkcd.com/${choice}/`);
            } else {
                message.member.send("Here's a random comic from xkcd.com':\n");
                message.member.send(`https://xkcd.com/${choice}/`);
            }
        })();
    },
};