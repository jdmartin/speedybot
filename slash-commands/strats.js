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
                    { name: "Sepulchre", value: "sepulchre" },
                    { name: "Sanctum", value: "sanctum" },
                    { name: "Nathria", value: "nathria" },
                    { name: "Vault", value: "vault" },
                    { name: "Aberrus", value: "aberrus" },
                ),
        ),

    async execute(interaction) {
        const shadowlandsRaids = ["sanctum", "nathria", "sepulchre"];
        const dragonflightRaids = ["vault", "aberrus"];
        const Shadowlands = require("../resources/strats/shadowlands.js");
        const Dragonflight = require("../resources/strats/dragonflight.js");

        const raidChoice = interaction.options.getString("raid_name");
        var expansionChoice = "";
        let embeds = [];

        if (shadowlandsRaids.includes(raidChoice)) {
            expansionChoice = "Shadowlands";
            embeds = [Shadowlands[raidChoice]]; // Access the embed object from the Shadowlands module based on raidChoice
        } else if (dragonflightRaids.includes(raidChoice)) {
            expansionChoice = "Dragonflight";
            embeds = [Dragonflight[raidChoice]]; // Access the embed object from the Dragonflight module based on raidChoice
        }

        interaction.reply({
            content: "It's dangerous to go alone!  Take these:\n",
            embeds: embeds,
            ephemeral: true,
        });
    },
};
