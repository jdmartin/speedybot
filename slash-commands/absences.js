import { MessageFlags, SlashCommandBuilder } from "discord.js";

import { DataDisplayTools } from "../utils/attendance.js";
const absenceDBHelper = new DataDisplayTools();

export const data = new SlashCommandBuilder()
    .setName("absences")
    .setDescription("Show a list of known absences.")
    .addStringOption((option) => option
        .setName("kind")
        .setDescription("how much do you want to know?")
        .setRequired(true)
        .addChoices(
            { name: "today", value: "today" },
            { name: "all", value: "all" },
            { name: "mine", value: "mine" }
        )
    );

export async function execute(interaction) {
    const name = interaction.user.username;

    let option = interaction.options.get("kind").value;
    let response = absenceDBHelper.show(name, option);
    interaction.reply({ embeds: [response.absentEmbed, response.lateEmbed, response.apiEmbed], flags: MessageFlags.Ephemeral });
}
