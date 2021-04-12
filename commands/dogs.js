module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(message, args) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const fetch = require('node-fetch');
        if (args === 'corgi') {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breed/corgi/images/random').then(response => response.json());
                message.reply(message);
            })();
        } else {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
                message.reply(message);
            })();
        }
    },
};