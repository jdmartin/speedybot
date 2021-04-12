module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    execute(message, args) {
        const fetch = require('node-fetch');
        (async function () {
            const {
                url
            } = await fetch('https://random.dog/woof.json?include=jpg,jpeg,png').then(response => response.json());
            message.reply(url);
        })();
    },
};