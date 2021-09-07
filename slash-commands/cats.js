const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cats')
        .setDescription('See a random cat!'),
    async execute(interaction) {
        const https = require("https");
        const querystring = require('query-string');
        //Kick Off
        getTheCat();

        async function showTheCat(catUrl) {
            interaction.reply(catUrl);
        }

        async function getTheCat() {
            var query_params = {
                'mime_types': 'jpg,png', // we only want static images as Discord doesn't like gifs
                'limit': 1 // only need one
            }
            // convert this obejct to query string 
            let queryString = querystring.stringify(query_params);
            try {
                var theCatUrl = 'https://api.thecatapi.com/v1/images/search?api_key=' + process.env.CAT_API_KEY + '&' + queryString;
                https.get(theCatUrl, res => {
                    res.setEncoding("utf8");
                    let body = '';
                    res.on("data", data => {
                        body += data;
                    });
                    res.on("end", () => {
                        var bodyParsed = JSON.parse(body);
                        showTheCat(bodyParsed[0].url);
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
    },
};