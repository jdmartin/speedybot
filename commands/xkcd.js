module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        function getRandomArbitrary(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        const fetch = require('node-fetch');

        const {
            num
        } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());

        const choice = getRandomArbitrary(1, num);

        message.reply(choice);

        //        
        //       (async function () {
        //         const {
        //           img
        //     } = await fetch(`https://xkcd.com/${choice}/info.0.json`).then(response => response.json());
        //   message.reply(img);
        //})();
    },
};