import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("cats")
    .setDescription("See a random cat!");

export async function execute(interaction) {
    await interaction.deferReply();

    const params = new URLSearchParams({
        mime_types: "jpg,png",
        limit: 1,
        api_key: process.env.CAT_API_KEY,
    });

    const url = `https://api.thecatapi.com/v1/images/search?${params.toString()}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const imageUrl = data[0]?.url;

        if (!imageUrl) {
            return interaction.editReply("😿 Couldn't fetch a cat right now.");
        }

        await interaction.editReply(imageUrl);
    } catch (err) {
        console.error(err);
        await interaction.editReply("😿 Error fetching cat image!");
    }
}
