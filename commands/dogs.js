module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(message, args) {
        const fetch = require('node-fetch');
        if (message.first() === 'corgi') {
            (async function () {
                const {
                    response
                } = await fetch('https://dog.ceo/api/breed/corgi/images/random').then(response => response.json());
                message.reply(response);
            })();
        } else {
            (async function () {
                const {
                    response
                } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
                message.reply(response);
            })();
        }
    },
};