module.exports = {
    name: 'foxes',
    description: 'See a random fox!',
    usage: '',
    notes: 'Foxes from https://randomfox.ca/',
    execute(message, args) {
        const fetch = require('node-fetch');
        (async function () {
            const {
                image
            } = await fetch('https://randomfox.ca/floof/').then(response => response.json());
            message.reply(image);
        })();
    },
};