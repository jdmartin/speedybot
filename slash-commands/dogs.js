import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("dogs")
    .setDescription("See a random dog!")
    .addStringOption((option) =>
        option
            .setName("breed")
            .setDescription("The dog breed")
            .setRequired(true)
            .addChoices(
                { name: "cardigan", value: "corgi/cardigan" },
                { name: "corgi", value: "corgi" },
                { name: "german shepherd", value: "germanshepherd" },
                { name: "husky", value: "husky" },
                { name: "pembroke", value: "pembroke" },
                { name: "pitbull", value: "pitbull" },
                { name: "poodle", value: "poodle/standard" },
                { name: "pug", value: "pug" },
                { name: "random", value: "random" }
            )
    );

export async function execute(interaction) {
    const breed = interaction.options.get("breed").value;

    await interaction.deferReply();

    try {
        const url =
            breed === "random"
                ? "https://dog.ceo/api/breeds/image/random"
                : `https://dog.ceo/api/breed/${breed}/images/random`;

        const res = await fetch(url);
        const data = await res.json();

        const imageUrl = data.message;
        if (!imageUrl) {
            return interaction.editReply("🐶 Could not fetch a dog image!");
        }

        await interaction.editReply(imageUrl);
    } catch (err) {
        console.error(err);
        await interaction.editReply("🐶 Error fetching dog image!");
    }
}
