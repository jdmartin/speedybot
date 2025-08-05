import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { GetStats } from "../utils/speedydb.js";
const speedyStats = new GetStats();

export const data = new SlashCommandBuilder().setName("xyzzy").setDescription("Get command usage stats (resets when Speedy does).");
export async function execute(interaction) {
    let response = speedyStats.retrieve();
    interaction.reply({ embeds: [response.slashEmbed], flags: MessageFlags.Ephemeral });
}
