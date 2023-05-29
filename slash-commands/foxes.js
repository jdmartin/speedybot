const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("foxes").setDescription("See a random fox!"),
    async execute(interaction) {
        const https = require("https");
        (async function () {
            const { image } = https.get("https://randomfox.ca/floof/", (res) => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", (data) => {
                    body += data;
                });
                res.on("end", () => {
                    var bodyParsed = JSON.parse(body);
                    interaction.reply(bodyParsed.image);
                });
            });
        })();
    },
};
