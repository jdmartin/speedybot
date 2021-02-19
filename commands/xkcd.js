module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        const fetch = require('node-fetch');
        
        (async function getImg (choice) {
            const {
            img
        } = await fetch(`https://xkcd.com/${choice}/info.0.json`).then(response => response.json());
        message.reply(img);
    })();

        (async function getANum () {
            const {
            num
        } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());
            const choice = Math.round(Math.random() * (num - 1) + 1);
            getImg(choice);
    })();
        getANum();
    },
};