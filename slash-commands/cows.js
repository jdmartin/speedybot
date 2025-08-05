import { readdirSync } from "node:fs";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { SpeedyTools } from "../utils/speedyutils.js";
const utils = new SpeedyTools();
const getRandomIntInclusive = utils.getRandomIntInclusive;

export const data = new SlashCommandBuilder().setName("cows").setDescription("Moooooooooo!");
export async function execute(interaction) {
    var files = readdirSync("resources/images/cows/");
    let chosenFile = files[getRandomIntInclusive(0, files.length - 1)];
    const file = new AttachmentBuilder(`resources/images/cows/${chosenFile}`);
    interaction.reply({
        content: "Moooooooo:",
        files: [file],
    });
}
