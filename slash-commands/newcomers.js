import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { WelcomeDataDisplayTools } from "../utils/welcome.js";

const newcomerDBHelper = new WelcomeDataDisplayTools();

export const data = new SlashCommandBuilder()
    .setName("newcomers")
    .setDescription("Show a list of pending newcomers who still have the newcomer role.");

export async function execute(interaction) {
    // Await the display response since checking roles requires async API calls
    let response = await newcomerDBHelper.showPending(interaction);

    await interaction.reply({
        embeds: [response.newcomersEmbed],
        flags: MessageFlags.Ephemeral
    });
}
