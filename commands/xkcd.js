module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        const fetch = require('node-fetch');
        (async function () {
            const {
                num
            } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());
            message.reply(num);
        })();
    },
};