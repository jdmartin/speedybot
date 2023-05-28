const { SlashCommandBuilder } = require("discord.js");

const absence = require("../db/absencedb-slash.js");
const absenceDBHelper = new absence.DataDisplayTools();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("absences")
        .setDescription("Show a list of known absences.")
        .addStringOption((option) =>
            option
                .setName("kind")
                .setDescription("how much do you want to know?")
                .setRequired(true)
                .addChoices(
                    { name: "all", value: "all" },
                    { name: "mine", value: "mine" },
                    { name: "today", value: "today" },
                ),
        ),

    async execute(interaction) {
        const name = interaction.user.username;

        let option = interaction.options.get("kind").value;
        let response = absenceDBHelper.show(name, option);
        interaction.reply({ embeds: [response.absentEmbed, response.lateEmbed], ephemeral: true });
    },
};
