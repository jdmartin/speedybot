const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dogs')
        .setDescription('See a random dog!')
        .addStringOption(option =>
            option.setName('breed')
            .setDescription('The dog breed')
            .setRequired(true)
            .addChoice('cardigan', 'corgi/cardigan')
            .addChoice('corgi', 'corgi')
            .addChoice('german shepherd', 'germanshepherd')
            .addChoice('husky', 'husky')
            .addChoice('pembroke', 'pembroke')
            .addChoice('poodle', 'poodle/standard')
            .addChoice('random', 'random')),

    async execute(interaction) {
        const https = require("https");
        let option = interaction.options.get("breed").value;
        //Kick Off
        getTheDog();

        async function getTheDog() {
            if (option === 'random') {
                (async function () {
                    https.get('https://dog.ceo/api/breeds/image/random', res => {
                        res.setEncoding("utf8");
                        let body = '';
                        res.on("data", data => {
                            body += data;
                        });
                        res.on("end", () => {
                            var bodyParsed = JSON.parse(body);
                            let message = bodyParsed.message;
                            interaction.reply(message);
                        });
                    })
                })();
            } else if (option.length) {
                (async function () {
                    https.get(`https://dog.ceo/api/breed/${option}/images/random`, res => {
                        res.setEncoding("utf8");
                        let body = '';
                        res.on("data", data => {
                            body += data;
                        });
                        res.on("end", () => {
                            var bodyParsed = JSON.parse(body);
                            let message = bodyParsed.message;
                            interaction.reply(message);
                        });
                    })
                })();
            }
        }
    },
};