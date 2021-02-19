module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        const fetch = require('node-fetch');

        const {
            num
        } = fetch('https://xkcd.com/info.0.json').then(response => response.json());

        (async function (num) {
            const choice = getRandomArbitrary(1, num);
            const {
                img
            } = fetch('https://xkcd.com/${choice}/info.0.json').then(response => response.json());
            message.reply(img);
        })();
    },
};