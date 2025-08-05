import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("corkboard").setDescription("What's the link and code?");
export async function execute(interaction) {
    const button = new ButtonBuilder()
        .setLabel("Visit the Corkboard")
        .setURL("https://velocitycorkboard.com")
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(button);
    let response = `The password is: "**${process.env.CORKBOARD_PASS}**"\n\n`;
    interaction.reply({ content: response, components: [row], flags: MessageFlags.Ephemeral });
}
