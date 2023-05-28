const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("xkcd").setDescription("Get a random xkcd comic!"),
    async execute(interaction) {
        const https = require("https");

        (async function () {
            const { num } = https.get("https://xkcd.com/info.0.json", (res) => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", (data) => {
                    body += data;
                });
                res.on("end", () => {
                    var bodyParsed = JSON.parse(body);
                    let theNum = bodyParsed.num;
                    const choice = Math.round(Math.random() * (theNum - 1) + 1);
                    interaction.reply(`Here's a random comic from xkcd.com: https://xkcd.com/${choice}/\n`);
                });
            });
        })();
    },
};
