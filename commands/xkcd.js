module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        const fetch = require('node-fetch');
        
        async function getANumber() {
        const latest = await fetch('https://xkcd.com/info.0.json').then(response => response.json());
        const num = await latest.json();
        
        const choice = Math.round(Math.random() * (`${num}` - 1) + 1); 
        return choice
    }
      
        (async function getImg () {
            const choice = await getANumber()
                 const {
                   img
             } = await fetch(`https://xkcd.com/${choice}/info.0.json`).then(response => response.json());
             message.reply(img);
        })();
    },
};