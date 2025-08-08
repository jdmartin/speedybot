import { MessageFlags, SlashCommandBuilder } from "discord.js";
import * as Shadowlands from "../resources/strats/shadowlands.js";
import * as Dragonflight from "../resources/strats/dragonflight.js";
import * as TWW from "../resources/strats/tww.js";

export const data = new SlashCommandBuilder()
    .setName("strats")
    .setDescription("Get all the links to strats for the current raid, or for an older raid.")
    .addStringOption((option) =>
        option
            .setName("raid_name")
            .setDescription("Name of the Raid")
            .setRequired(true)
            .addChoices(
                { name: "Manaforge", value: "manaforge" },
                { name: "Undermine", value: "undermine" },
                { name: "Nerub-ar Palace", value: "nerub" },
                { name: "Amirdrassil", value: "amirdrassil" },
                { name: "Aberrus", value: "aberrus" },
                { name: "Nathria", value: "nathria" },
                { name: "Sanctum", value: "sanctum" },
                { name: "Sepulchre", value: "sepulchre" },
                { name: "Vault", value: "vault" },
            )
    );

export async function execute(interaction) {
    const raidExpansionMap = {
        manaforge: TWW,
        undermine: TWW,
        nerub: TWW,
        amirdrassil: Dragonflight,
        aberrus: Dragonflight,
        vault: Dragonflight,
        sepulchre: Shadowlands,
        sanctum: Shadowlands,
        nathria: Shadowlands,
    };

    const raidChoice = interaction.options.getString("raid_name");

    if (!raidExpansionMap[raidChoice]) {
        return interaction.reply({
            content: `Sorry, I don't have any strats for that raid.`,
            flags: MessageFlags.Ephemeral,
        });
    }

    const expansion = raidExpansionMap[raidChoice];
    const embed = expansion[raidChoice];

    await interaction.reply({
        content: "It's dangerous to go alone! Take these:\n",
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
}
