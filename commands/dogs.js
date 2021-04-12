module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(message, args) {
        const fetch = require('node-fetch');
        if (!args.length) {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
                message.reply(message);
            })();
        } else if (args[0] === 'corgi') {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breed/corgi/images/random').then(response => response.json());
                message.reply(message);
            })();
        }
    },
};