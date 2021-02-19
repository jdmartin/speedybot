module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        const fetch = require('node-fetch');

        const {
            num
        } = fetch('https://xkcd.com/info.0.json').then(response => response.json());

        var currentComic = num;
        const choice = Math.round(Math.random() * (`${currentComic}` - 1) + 1);

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