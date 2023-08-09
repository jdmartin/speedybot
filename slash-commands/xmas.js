const { ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
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
            .setPlaceholder("Enter a number or 'all'")
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

        const xmasAddressInput = new TextInputBuilder()
            .setCustomId("xmasAddressInput")
            .setLabel("Address (only visible to Leisa and Evie!):")
            .setPlaceholder("Required to get cards. If you plan to provide this some other way, please indicate that.")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(xmasCardsCountInput);
        const secondActionRow = new ActionRowBuilder().addComponents(xmasNotesInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(xmasAddressInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        const handleInteraction = async (receivedInteraction) => {
            if (receivedInteraction.isModalSubmit() && receivedInteraction.customId === "xmasModal") {
                const xmasCardsCount = receivedInteraction.fields.getTextInputValue("xmasCardsCountInput");
                const xmasNotes = receivedInteraction.fields.getTextInputValue("xmasNotesInput");
                const xmasAddress = receivedInteraction.fields.getTextInputValue("xmasAddressInput");
                var processedAddress = "";
                if (xmasAddress.length == 0) {
                    processedAddress = "On File";
                } else {
                    processedAddress = xmasAddress;
                }
                console.log({ xmasCardsCount, xmasNotes });

                let theName = "";
                if (receivedInteraction.member.nickname != null) {
                    theName = receivedInteraction.member.nickname;
                } else {
                    theName = receivedInteraction.user.username;
                }

                xmas.addElf(theName, xmasCardsCount, xmasNotes, processedAddress);

                await receivedInteraction.reply({
                    content: process.env.xmas_address,
                    ephemeral: true,
                });

                // Remove the event listener after handling the interaction
                client.off("interactionCreate", handleInteraction);
            }
        };

        client.on("interactionCreate", handleInteraction);
    },
};
