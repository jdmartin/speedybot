const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("strats")
        .setDescription("Get all the links to strats for the current raid, or for an older raid.")
        .addStringOption((option) =>
            option
                .setName("raid_name")
                .setDescription("Name of the Raid")
                .setRequired(true)
                .addChoices(
                    { name: "Nerub-ar Palace", value: "nerub" },
                    { name: "Amirdrassil", value: "amirdrassil" },
                    { name: "Aberrus", value: "aberrus" },
                    { name: "Nathria", value: "nathria" },
                    { name: "Sanctum", value: "sanctum" },
                    { name: "Sepulchre", value: "sepulchre" },
                    { name: "Vault", value: "vault" },
                ),
        ),

    async execute(interaction) {
        const raidExpansionMap = new Map();
        raidExpansionMap.set("nerub", "TWW");
        raidExpansionMap.set("amirdrassil", "Dragonflight");
        raidExpansionMap.set("aberrus", "Dragonflight");
        raidExpansionMap.set("nathria", "Shadowlands");
        raidExpansionMap.set("sanctum", "Shadowlands");
        raidExpansionMap.set("sepulchre", "Shadowlands");
        raidExpansionMap.set("vault", "Dragonflight");

        const Shadowlands = require("../resources/strats/shadowlands.js");
        const Dragonflight = require("../resources/strats/dragonflight.js");
        const TWW = require("../resources/strats/tww.js");

        const raidChoice = interaction.options.getString("raid_name");
        let expansionChoice = "";
        let embeds = [];

        if (raidExpansionMap.has(raidChoice)) {
            expansionChoice = raidExpansionMap.get(raidChoice);
            switch (expansionChoice) {
                case "Shadowlands":
                    embeds = [Shadowlands[raidChoice]];
                    break;
                case "Dragonflight":
                    embeds = [Dragonflight[raidChoice]];
                    break;
                case "TWW":
                    embeds = [TWW[raidChoice]];
                    break;
            }
        }

        await interaction.reply({
            content: "It's dangerous to go alone! Take these:\n",
            embeds: embeds,
            ephemeral: true,
        });
    },
};
