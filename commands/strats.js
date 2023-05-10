module.exports = {
    name: "strats",
    description: "Get all the links to strats for the current raid, or for an older raid.",
    usage: "[optional raid name]",
    notes: "Right now, the only optional names are: nathria and sanctum",
    execute(message, args) {
        const Shadowlands = require("../resources/strats/shadowlands.js");
        const Dragonflight = require("../resources/strats/dragonflight.js");

        if (!args.length) {
            message.channel.send({
                content:
                    "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Dragonflight.aberrus],
            });
        } else if (args[0].toLowerCase() === "sepulchre") {
            message.channel.send({
                content:
                    "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Shadowlands.sepulchre],
            });
        } else if (args[0].toLowerCase() === "sanctum") {
            message.channel.send({
                content:
                    "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Shadowlands.sanctum],
            });
        } else if (args[0].toLowerCase() === "nathria") {
            message.channel.send({
                content:
                    "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Shadowlands.nathria],
            });
        } else if (args[0].toLowerCase() === "vault") {
            message.channel.send({
                content:
                    "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Dragonflight.vault],
            });
        } else if (args[0].toLowerCase() === "aberrus") {
            message.channel.send({
                content:
                    "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Dragonflight.aberrus],
            });
        }
    },
};
