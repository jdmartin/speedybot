import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("rules").setDescription("Rules for Raiding!");
export async function execute(interaction) {
    const button = new ButtonBuilder()
        .setLabel("Visit the Corkboard")
        .setURL("https://velocitycorkboard.com")
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(button);

    interaction.reply({
        content:
            "Times have changed!\n\nTo see the latest rules, visit [#raider-contract](https://discord.com/channels/308622057707536385/1482542679366696991).\n\nYou can also see the latest version on the Corkboard!",
        components: [row],
        flags: MessageFlags.Ephemeral,
    });
}
