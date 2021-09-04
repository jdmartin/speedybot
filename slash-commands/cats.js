const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cats')
        .setDescription('See a random cat!'),
    async execute(interaction) {
        const fetch = require('node-fetch');
        const querystring = require('query-string');
        //Kick Off
        showTheCat();

        async function showTheCat() {
            var result = await getTheCat();
            var theBody = result[0].url;

            return interaction.reply(theBody);
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
                const response = await fetch(theCatUrl);
                const data = await response.json();
                return (data);

            } catch (error) {
                console.log(error);
            }
        }
    },
};