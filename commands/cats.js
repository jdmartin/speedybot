module.exports = {
    name: 'cats',
    description: 'See a random cat!',
    usage: '',
    notes: 'Cats from https://aws.random.cat/ and https://thecatapi.com/',
    execute(message) {
        const fetch = require('node-fetch');
        const querystring = require('query-string');
        try {
            (async function () {
                const {
                    file
                } = await fetch('https://aws.random.cat/meow').then(response => response.json());
                message.reply(file);
            })();
        } catch (e) {
            if (e) {
                //Kick Off
                showTheCat();

                async function showTheCat() {
                    var result = await getTheCat();
                    var theBody = result[0].url;

                    message.reply(theBody);
                }

                async function getTheCat() {
                    var query_params = {
                        'mime_types': 'jpg,jpeg,png', // we only want static images as Discord doesn't like gifs
                        'limit': 1 // only need one
                    }
                    // convert this obejc to query string 
                    let queryString = querystring.stringify(query_params);
                    try {
                        var theCatUrl = 'https://api.thecatapi.com/v1/images/search?api_key=' + process.env.CAT_API_KEY + '&' + queryString;
                        const response = await fetch(theCatUrl);
                        const data = await response.json();
                        return (data);

                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }
}