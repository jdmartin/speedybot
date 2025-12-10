import { SlashCommandBuilder } from "discord.js";
import { SpeedyTools } from "../utils/speedyutils.js";
const utils = new SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

export const data = new SlashCommandBuilder().setName("xkcd").setDescription("Get a random XKCD comic!");

export async function execute(interaction) {
    try {
        const res = await fetch("https://xkcd.com/info.0.json");
        const { num } = await res.json();

        const choice = getRandomIntInclusive(1, num + 1);
        const url = `https://xkcd.com/${choice}/`;

        await interaction.reply(`Here's a random comic from XKCD: ${url}`);
    } catch (err) {
        console.error(err);
        await interaction.reply("⚠️ Couldn't fetch XKCD right now!");
    }
}
