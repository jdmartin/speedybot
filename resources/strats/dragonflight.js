import { EmbedBuilder } from "discord.js";

const theCommonStem = process.env.STRATS_COMMON_STEM || "";
const theCommonAlso = process.env.STRATS_COMMON_ALSO || "";

const vault = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🐉",
    })
    .setDescription("__Vault of the Incarnates__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: `[Eranog](${theCommonStem}/1058466953662038057)\n[Terros](${theCommonStem}/1058467658166702220)\n[Primal Council](${theCommonStem}/1058468190402916434)\n[Sennarth](${theCommonStem}/1058647599298662450)\n[Dathea](${theCommonStem}/1061527171509780481)\n[Grimtotem](${theCommonStem}/1061708638240112671)\n[Broodkeeper](${theCommonStem}/1064285600049549433)\n[Razageth](${theCommonStem}/1064325746656559155)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

const aberrus = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🔥",
    })
    .setDescription("__Aberrus the Shadowed Crucible__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: `[Kazzara](${theCommonStem}/1104819683665924227)\n[Amalgamation](${theCommonStem}/1104868085783085189)\n[Forgotten Experiments](${theCommonStem}/1104945847411687526)\n[Zaqali](${theCommonStem}/1105176927116984411)\n[Rashok](${theCommonStem}/1105959477695492137)\n[Zskarn](${theCommonStem}/1106339864825299085)\n[Magmorax](${theCommonStem}/1106383136704696430)\n[Neltharion](${theCommonStem}/1106957389518884875)\n[Sarkareth](${theCommonStem}/1107146371305328691) ([actual](${theCommonStem}/1107331472689475745))\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

const amirdrassil = new EmbedBuilder()
    .setTitle("Evie's Strats!")
    .setColor(0xffffff)
    .setAuthor({
        name: "🔥",
    })
    .setDescription("__Amirdrassil, the Dream's Hope__")
    .setFooter({
        text: "SpeedyBot is not responsible for any fire-standing, mutilation, or permanent loss of gold or seaweed...",
    })
    .addFields({
        name: "Bosses",
        value: `[Gnarlroot](${theCommonStem}/1172430588809052171)\n[Igira](${theCommonStem}/1172431212883746879)\n[Volcoross](${theCommonStem}/1172431670134198272)\n[Dream Council](${theCommonStem}/1172432586891591690)\n[Larodar](${theCommonStem}/1174208329455779920)\n[Nymue](${theCommonStem}/1175603971142979646)\n[Smolderon](${theCommonStem}/1175606134825046026)\n[Tindral](${theCommonStem}/1179523016632320040)\n[Fyrakk](${theCommonStem}/1179596375797792838)\n`,
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: `${theCommonAlso}`,
    });

export { aberrus, vault, amirdrassil };
