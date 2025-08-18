import { EmbedBuilder } from "discord.js";

const theCommonStem = process.env.STRATS_COMMON_STEM || "";
const theCommonAlso = process.env.STRATS_COMMON_ALSO || "";

const manaforge = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🧿",
    })
    .setDescription("__Manaforge__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: `[Plexus Sentinel](${theCommonStem}/1403034952026685540)\n[Loom'ithar](${theCommonStem}/1403049142539911228)\n[Soulbinder](${theCommonStem}/1403417292389355560)\n[Forgeweaver Araz](${theCommonStem}/1403931594468622368)\n[Fractillus](${theCommonStem}/1404537847960174732)\n[Soul Hunters](${theCommonStem}/1405363939721744395)\n[Salhadaar](${theCommonStem}/1405965507290599486\n[Dimensius](${theCommonStem}/1406769622740500681)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

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
        value: `[Geargrinder](${theCommonStem}/1343807743462740019)\n[Cauldron](${theCommonStem}/1343807959481978961)\n[Reverb](${theCommonStem}/1345954308415295549)\n[Junker](${theCommonStem}/1345954442058534962)\n[Sprocketmonger](${theCommonStem}/1347075404493488209)\n[One-armed Bandit](${theCommonStem}/1347123769348460616)\n[Mug'Zee](${theCommonStem}/1348172193095352381)\n[Gallywix](${theCommonStem}/1348195677276213358)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
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
        value: `[Ulgrax the Devourer](${theCommonStem}/1278829737405448225)\n[Bloodbound Horror](${theCommonStem}/1279308757582741525)\n[Sikran](${theCommonStem}/1279659275131551859)\n[Rasha'nan](${theCommonStem}/1280026118400770058)\n[Ovi'nax](${theCommonStem}/1282189935188643891)\n[Ky'veza](${theCommonStem}/1283625809587998740)\n[Silken Court](${theCommonStem}/1283679790041268306)\n[Ansurek](${theCommonStem}/1283860780147802145)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

export { manaforge, nerub, undermine };
