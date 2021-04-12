module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(ds_message, args) {
        const fetch = require('node-fetch');
        if (!args.length) {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
                ds_message.reply(message);
            })();
        } else if (args[0] === 'corgi') {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breed/corgi/images/random').then(response => response.json());
                ds_message.reply(message);
            })();
        } else if (args[0] === 'husky') {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breed/husky/images/random').then(response => response.json());
                ds_message.reply(message);
            })();
        } else {
            ds_message.reply("Sorry, I don't understand. Try `!dogs` for a random dog, or `!dogs corgi` for a corgi.")
        }
    },
};