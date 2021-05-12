module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(ds_message, args) {
        const fetch = require('node-fetch');
        const dogsDict = {
            corgi: 'https://dog.ceo/api/breed/corgi/images/random',
            cardigan: 'https://dog.ceo/api/breed/corgi/cardigan/images/random',
            poodle: 'https://dog.ceo/api/breed/poodle/standard/images/random',
            husky: 'https://dog.ceo/api/breed/husky/images/random'
        };

        if (!args.length) {
            (async function () {
                const {
                    message
                } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
                ds_message.reply(message);
            })();
        } else if (args[0] in (dogsDict)) {
            (async function () {
                const {
                    message
                } = await fetch(dogsDict[args[0]]).then(response => response.json());
                ds_message.reply(message);
            })();
        } else {
            ds_message.reply("Sorry, I don't understand. Try `!dogs` for a random dog, `!dogs corgi` for a corgi, `!dogs cardigan` for a cardigan corgi, `!dogs poodle` for a poodle, or `!dogs husky` for a husky.")
        }
    },
};