import { EmbedBuilder } from "discord.js";

const theCommonStem = process.env.STRATS_COMMON_STEM || "";
const theCommonAlso = process.env.STRATS_COMMON_ALSO || "";

const voidspire = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🧿",
    })
    .setDescription("__Voidspire__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: `[Averzian](${theCommonStem}/1483550337586430115)\n[Vorasius](${theCommonStem}/1483551345117237299)\n[SaladBaar](${theCommonStem}/1483552452757422263)\n[Vaelgor and Ezzorak](${theCommonStem}/1485791215059210280)\n[Vanguard](${theCommonStem}/1488250937939198154)\n[Crown of the Cosmos](${theCommonStem}/1488253337513099338)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

const dreamrift = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🧿",
    })
    .setDescription("__Dreamrift__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: `[Chimaerus](${theCommonStem}/1483549032163835934)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

export { voidspire, dreamrift };
