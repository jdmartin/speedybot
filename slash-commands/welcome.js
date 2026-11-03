import { ActionRowBuilder, DiscordAPIError, MessageFlags, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { WelcomeTools } from "../utils/welcome.js";

const welcomeHelper = new WelcomeTools();
const processingUsers = new Set();

export const data = new SlashCommandBuilder()
    .setName("newcomer")
    .setDescription("Introduce yourself and share your info with the Infinite Speedyflight!");

export async function execute(interaction) {
    const uniqueCustomId = `welcomeModal_${interaction.user.id}_${Date.now()}`;
    const modal = new ModalBuilder()
        .setCustomId(uniqueCustomId)
        .setTitle("Welcome, Stranger!");

    // Create the text input components for newcomer details
    const inGameNameInput = new TextInputBuilder()
        .setCustomId("inGameNameInput")
        .setLabel("What is your In-Game Name?")
        .setPlaceholder("Ex: SpeedyTheGreat")
        .setMinLength(1)
        .setMaxLength(50)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const howFoundInput = new TextInputBuilder()
        .setCustomId("howFoundInput")
        .setLabel("How did you find us?")
        .setPlaceholder("Ex: Character Name, Friend Name, Mystical Shrine Location...")
        .setMinLength(1)
        .setMaxLength(100)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const commentInput = new TextInputBuilder()
        .setCustomId("commentInput")
        .setLabel("(Optional) Anything else we should know?")
        .setPlaceholder("List of alts, planning to raid, etc.")
        .setMinLength(0)
        .setMaxLength(500)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    // Each text input requires its own ActionRow
    const row1 = new ActionRowBuilder().addComponents(inGameNameInput);
    const row2 = new ActionRowBuilder().addComponents(howFoundInput);
    const row3 = new ActionRowBuilder().addComponents(commentInput);

    // Add inputs to the modal
    modal.addComponents(row1, row2, row3);

    // Show the modal to the user
    await interaction.showModal(modal);

    try {
        const filter = (i) => i.customId === uniqueCustomId;
        const collectedInteraction = await interaction.awaitModalSubmit({ filter, time: 300000 });

        if (collectedInteraction) {
            const in_game_name = collectedInteraction.fields.getTextInputValue("inGameNameInput");
            const how_found = collectedInteraction.fields.getTextInputValue("howFoundInput");
            const comment = collectedInteraction.fields.getTextInputValue("commentInput") || "";

            // Gather Discord identity info
            const discord_name = collectedInteraction.user.tag;
            const name = collectedInteraction.member?.nickname || collectedInteraction.user.username;

            if (processingUsers.has(interaction.user.id)) {
                await collectedInteraction.reply({
                    content: "Your previous submission is still being processed.",
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            processingUsers.add(interaction.user.id);
            try {
                welcomeHelper.addNewcomer(discord_name, name, in_game_name, how_found, comment);

                await collectedInteraction.reply({
                    content: "Welcome aboard! Your information has been saved successfully. 🐢",
                    flags: MessageFlags.Ephemeral
                });

            } finally {
                processingUsers.delete(interaction.user.id);
            }
        }
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === 10062) {
            console.log("User likely didn't finish. Caught 'Unknown Interaction' error.");
        }
        else if (error.code === 'InteractionAlreadyReplied') {
            console.log(`${interaction.user.tag} already replied.`);
        }
        else if (error.code === 'InteractionCollectorError') {
            console.log(`${interaction.user.tag} timed out.`);
        } else {
            console.error(error);
        }
    }
}
