import { SlashCommandBuilder } from "discord.js";
import { SpeedyTools } from "../utils/speedyutils.js";
const utils = new SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

export const data = new SlashCommandBuilder().setName("miniwheat").setDescription("Flip a Mini-Wheat!");
export async function execute(interaction) {
    let outcomes = ["frosted", "plain"];
    interaction.reply(
        `Your mini-wheat lands on the **${outcomes[getRandomIntInclusive(0, outcomes.length - 1)]}** side!`
    );
}
