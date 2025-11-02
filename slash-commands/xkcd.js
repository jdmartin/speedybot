import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("xkcd")
    .setDescription("Get a random XKCD comic!");

export async function execute(interaction) {
    try {
        const res = await fetch("https://xkcd.com/info.0.json");
        const { num } = await res.json();

        const choice = Math.floor(Math.random() * num) + 1;
        const url = `https://xkcd.com/${choice}/`;

        await interaction.reply(`Here's a random comic from XKCD: ${url}`);
    } catch (err) {
        console.error(err);
        await interaction.reply("⚠️ Couldn't fetch XKCD right now!");
    }
}
