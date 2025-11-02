import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("foxes")
    .setDescription("See a random fox!");

export async function execute(interaction) {
    const res = await fetch("https://randomfox.ca/floof/");
    const { image } = await res.json();
    await interaction.reply(image);
}
