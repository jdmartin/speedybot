const { EmbedBuilder } = require("discord.js");

const nerub = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🕸️",
    })
    .setDescription("__Nerub-ar Palace__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: "[Ulgrax the Devourer](https://discord.com/channels/308622057707536385/308626596623810562/1278829737405448225)\n[Bloodbound Horror](https://discord.com/channels/308622057707536385/308626596623810562/1279308757582741525)\n[Sikran](https://discord.com/channels/308622057707536385/308626596623810562/1279659275131551859)\n[Rasha'nan](https://discord.com/channels/308622057707536385/308626596623810562/1280026118400770058)\n",
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: "[Velocity Corkboard](https://velocitycorkboard.com/)",
    });

module.exports = {
    nerub: nerub,
};
