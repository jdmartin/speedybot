module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    aliases: ['dog'],
    usage: '[optional dog breed]',
    notes: 'These are the breeds you can use: cardigan, corgi, germanshepherd, husky, pembroke, and poodle.\nDogs courtesy of https://dog.ceo/dog-api/',
    execute(ds_message, args) {
        const fetch = require('node-fetch');
        const dogsDict = {
            corgi: 'corgi',
            cardigan: 'corgi/cardigan',
            pembroke: 'pembroke',
            poodle: 'poodle/standard',
            husky: 'husky',
            germanshepherd: 'germanshepherd'
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
                const breed = dogsDict[args[0]];
                const {
                    message
                } = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then(response => response.json());
                ds_message.reply(message);
            })();
        } else {
            ds_message.reply("Sorry, I don't understand. Try `!dogs` for a random dog, `!dogs corgi` for a corgi, `!dogs cardigan` for a cardigan corgi, `!dogs pembroke` for a Pembroke corgi, `!dogs poodle` for a poodle, `!dogs germanshepherd` for a german shepherd, or `!dogs husky` for a husky.")
        }
    },
};