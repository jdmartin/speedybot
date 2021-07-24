module.exports = {
    name: 'cats',
    description: 'See a random cat!',
    usage: '',
    notes: 'Cats from https://cataas.com/#/',
    execute(message) {
        const fetch = require('node-fetch');
        (async function () {
            const {
                url
            } = await fetch('https://cataas.com/cat/cute?json=true').then(response => response.json());
            let theCatUrl = "https://cataas.com" + url;
            message.reply(theCatUrl);
        })();
    },
};