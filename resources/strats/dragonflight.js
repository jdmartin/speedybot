const { EmbedBuilder } = require("discord.js");

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
        value: "[Eranog](https://discord.com/channels/308622057707536385/308626596623810562/1058466953662038057)\n[Terros](https://discord.com/channels/308622057707536385/308626596623810562/1058467658166702220)\n[Primal Council](https://discord.com/channels/308622057707536385/308626596623810562/1058468190402916434)\n[Sennarth](https://discord.com/channels/308622057707536385/308626596623810562/1058647599298662450)\n[Dathea](https://discord.com/channels/308622057707536385/308626596623810562/1061527171509780481)\n[Grimtotem](https://discord.com/channels/308622057707536385/308626596623810562/1061708638240112671)\n[Broodkeeper](https://discord.com/channels/308622057707536385/308626596623810562/1064285600049549433)\n[Razageth](https://discord.com/channels/308622057707536385/308626596623810562/1064325746656559155)\n",
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: "[Velocity Corkboard](https://velocitycorkboard.com/)",
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
        value: "[Kazzara](https://discord.com/channels/308622057707536385/308626596623810562/1104819683665924227)\n[Amalgamation](https://discord.com/channels/308622057707536385/308626596623810562/1104868085783085189)\n[Forgotten Experiments](https://discord.com/channels/308622057707536385/308626596623810562/1104945847411687526)\n[Zaqali](https://discord.com/channels/308622057707536385/308626596623810562/1105176927116984411)\n[Rashok](https://discord.com/channels/308622057707536385/308626596623810562/1105959477695492137)\n",
        inline: true,
    })
    .addFields({
        name: "See Also",
        value: "[Velocity Corkboard](https://velocitycorkboard.com/)",
    });

module.exports = {
    vault: vault,
    aberrus: aberrus,
};
