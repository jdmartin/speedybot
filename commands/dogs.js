module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(ds_message, args) {
        const fetch = require('node-fetch');
        const dogsDict = {
            corgi: 'corgi',
            cardigan: 'corgi/cardigan',
            poodle: 'poodle/standard',
            husky: 'husky'
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
                } = await fetch(`https://dog.ceo/api/breed/**${dogsDict[args[0]]}**/images/random`).then(response => response.json());
                ds_message.reply(message);
            })();
        } else {
            ds_message.reply("Sorry, I don't understand. Try `!dogs` for a random dog, `!dogs corgi` for a corgi, `!dogs cardigan` for a cardigan corgi, `!dogs poodle` for a poodle, or `!dogs husky` for a husky.")
        }
    },
};