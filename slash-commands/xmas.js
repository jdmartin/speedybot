const {
    ActionRowBuilder,
    Events,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");
const utils = require("../utils/speedyutils.js");
const xmasutils = require("../db/xmasdb.js");
const xmas = new xmasutils.XmasTools();
const client = utils.client;

//Load the config file.
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder().setName("xmas").setDescription("Christmas Cards"),

    async execute(interaction) {
        const modal = new ModalBuilder().setCustomId("xmasModal").setTitle("Christmas Card Swap!");

        // Create the text input components
        const xmasCardsCountInput = new TextInputBuilder()
            .setCustomId("xmasCardsCountInput")
            // The label is the prompt the user sees for this input
            .setLabel("How many cards would you like to send?")
            // Set placeholder
            .setPlaceholder("Enter a number")
            // At least 1 digit, not more than 3.
            .setMinLength(1)
            .setMaxLength(3)
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            // This is a required value
            .setRequired(true);

        const xmasNotesInput = new TextInputBuilder()
            .setCustomId("xmasNotesInput")
            .setLabel("Anything we should know?")
            .setPlaceholder("You can put a note to Leisa here...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(xmasCardsCountInput);
        const secondActionRow = new ActionRowBuilder().addComponents(xmasNotesInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId === "xmasModal") {
                await interaction.reply({
                    content: process.env.xmas_address,
                    ephemeral: true,
                });
            }
        });

        client.on(Events.InteractionCreate, (interaction) => {
            if (!interaction.isModalSubmit()) return;

            // Get the data entered by the user
            const xmasCardsCount = interaction.fields.getTextInputValue("xmasCardsCountInput");
            const xmasNotes = interaction.fields.getTextInputValue("xmasNotesInput");
            console.log({ xmasCardsCount, xmasNotes });
            let theName = "";
            if (interaction.member.nickname != null) {
                theName = interaction.member.nickname;
            } else {
                theName = interaction.user.username;
            }
            xmas.addElf(theName, xmasCardsCount, xmasNotes);
        });
    },
};
