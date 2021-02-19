module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        const fetch = require('node-fetch');
        const num = (async function () {
            const {
                num
            } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());

            return num
        })();
        
        const choice = getRandomArbitrary(1, num);
        (async function () {
            const {
                img
            } = await fetch(`https://xkcd.com/${choice}/info.0.json`).then(response => response.json());
            message.reply(img);
        })();
    },
};