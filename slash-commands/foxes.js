import { get } from 'node:https';
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("foxes").setDescription("See a random fox!");
export async function execute(interaction) {
    (async function () {
        const { image } = get("https://randomfox.ca/floof/", (res) => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", (data) => {
                body += data;
            });
            res.on("end", () => {
                var bodyParsed = JSON.parse(body);
                interaction.reply(bodyParsed.image);
            });
        });
    })();
}
