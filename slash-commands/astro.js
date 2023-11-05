const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("astro").setDescription("See NASA's Astronomy Pic of the Day!"),
    async execute(interaction) {
        const https = require("https");
        //Kick Off
        getTheAPOTD();

        async function showTheAPOTD(astroEmbed) {
            await interaction.deferReply();
            interaction.editReply({ embeds: [astroEmbed] });
        }

        async function getTheAPOTD() {
            try {
                const astroEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("NASA's Astronomy Pic of the Day").setFooter({ text: "Click the image to see the larger version (largest usually in browser)." });
                var theAPOTDUrl = "https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_API_KEY;

                https.get(theAPOTDUrl, (res) => {
                    res.setEncoding("utf8");
                    let body = "";

                    res.on("data", (data) => {
                        body += data;
                    });

                    res.on("end", () => {
                        var bodyParsed = JSON.parse(body);

                        astroEmbed.setImage(bodyParsed.url);

                        astroEmbed.addFields({
                            name: "URL",
                            value: bodyParsed.url
                        });

                        if (bodyParsed.hdurl != bodyParsed.url) {
                            astroEmbed.addFields({
                                name: "HD URL",
                                value: bodyParsed.hdurl
                            });
                        }

                        astroEmbed.addFields({
                            name: "Description",
                            value: bodyParsed.explanation
                        });

                        showTheAPOTD(astroEmbed);
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
    },
};
