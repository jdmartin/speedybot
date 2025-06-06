const { EmbedBuilder } = require("discord.js");

const undermine = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🎰",
    })
    .setDescription("__Undermine__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: "[Geargrinder](https://discord.com/channels/308622057707536385/308626596623810562/1343807743462740019)\n[Cauldron](https://discord.com/channels/308622057707536385/308626596623810562/1343807959481978961)\n[Reverb](https://discord.com/channels/308622057707536385/308626596623810562/1345954308415295549)\n[Junker](https://discord.com/channels/308622057707536385/308626596623810562/1345954442058534962)\n[Sprocketmonger](https://discord.com/channels/308622057707536385/308626596623810562/1347075404493488209)\n[One-armed Bandit](https://discord.com/channels/308622057707536385/308626596623810562/1347123769348460616)\n[Mug'Zee](https://discord.com/channels/308622057707536385/308626596623810562/1348172193095352381)\n[Gallywix](https://discord.com/channels/308622057707536385/308626596623810562/1348195677276213358)\n",
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: "[Velocity Corkboard](https://velocitycorkboard.com/)",
    });

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
        value: "[Ulgrax the Devourer](https://discord.com/channels/308622057707536385/308626596623810562/1278829737405448225)\n[Bloodbound Horror](https://discord.com/channels/308622057707536385/308626596623810562/1279308757582741525)\n[Sikran](https://discord.com/channels/308622057707536385/308626596623810562/1279659275131551859)\n[Rasha'nan](https://discord.com/channels/308622057707536385/308626596623810562/1280026118400770058)\n[Ovi'nax](https://discord.com/channels/308622057707536385/308626596623810562/1282189935188643891)\n[Ky'veza](https://discord.com/channels/308622057707536385/308626596623810562/1283625809587998740)\n[Silken Court](https://discord.com/channels/308622057707536385/308626596623810562/1283679790041268306)\n[Ansurek](https://discord.com/channels/308622057707536385/308626596623810562/1283860780147802145)\n",
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: "[Velocity Corkboard](https://velocitycorkboard.com/)",
    });

module.exports = {
    nerub: nerub,
    undermine: undermine,
};
