import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("logs").setDescription("Replies with the guild's raiding logs.");
export async function execute(interaction) {
    return interaction.reply("Our logs are here: https://www.warcraftlogs.com/guild/reports-list/41907/");
}
