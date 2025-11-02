import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("astro")
    .setDescription("See NASA's Astronomy Pic of the Day!");

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setColor(0xffffff)
        .setTitle("NASA's Astronomy Pic of the Day")
        .setFooter({ text: "Click the link to see the larger version (largest usually in browser)." });

    try {
        const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.media_type !== "video" && data.url) {
            embed.setImage(data.url);
        }

        if (data.hdurl) {
            embed.addFields({ name: "URL", value: data.hdurl });
        } else if (data.url) {
            embed.addFields({ name: "URL", value: data.url });
        }

        if (data.explanation) {
            embed.addFields({ name: "Description", value: truncateText(data.explanation, 1024) });
        }

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: "⚠️ Could not fetch NASA APOD.", flags: MessageFlags.Ephemeral });
    }
}
