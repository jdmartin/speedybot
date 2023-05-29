const {
    ActionRowBuilder,
    Events,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");
const utils = require("../utils/speedyutils.js");
const client = utils.client;

module.exports = {
    data: new SlashCommandBuilder().setName("xmas").setDescription("Christmas Cards"),

    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId("xmasModal").setTitle("Christmas Card Swap!");

        // Add components to modal

        // Create the text input components
        const cardsCountInput = new TextInputBuilder()
            .setCustomId("cardsCountInput")
            // The label is the prompt the user sees for this input
            .setLabel("How many cards would you like to send?")
            // Set placeholder
            .setMinLength(1)
            .setMaxLength(3)
            .setPlaceholder("Enter a number")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const notesInput = new TextInputBuilder()
            .setCustomId("notesInput")
            .setLabel("Anything we should know?")
            .setPlaceholder("You can put a note to Leisa here...")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(cardsCountInput);
        const secondActionRow = new ActionRowBuilder().addComponents(notesInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId === "xmasModal") {
                await interaction.reply({ content: "Your submission was received successfully!", ephemeral: true });
            }
        });

        client.on(Events.InteractionCreate, (interaction) => {
            if (!interaction.isModalSubmit()) return;

            // Get the data entered by the user
            const cardsCount = interaction.fields.getTextInputValue("cardsCountInput");
            const notes = interaction.fields.getTextInputValue("notesInput");
            console.log({ cardsCount, notes });
        });
    },
};
