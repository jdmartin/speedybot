module.exports = {
    name: 'cats',
    description: 'See a random cat!',
    usage: '',
    notes: 'Cats from https://aws.random.cat/',
    execute(message, args) {
        const fetch = require('node-fetch');
        (async function () {
            const {
                file
            } = await fetch('https://aws.random.cat/meow').then(response => response.json());
            message.reply(file);
        })();
    },
};