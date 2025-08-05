import { get } from 'node:https';
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("dogs")
    .setDescription("See a random dog!")
    .addStringOption((option) => option
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
    let option = interaction.options.get("breed").value;
    //Kick Off
    getTheDog();

    async function showTheDog(dog) {
        await interaction.deferReply();
        interaction.editReply(dog);
    }

    async function getTheDog() {
        if (option === "random") {
            (async function () {
                get("https://dog.ceo/api/breeds/image/random", (res) => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", (data) => {
                        body += data;
                    });
                    res.on("end", () => {
                        var bodyParsed = JSON.parse(body);
                        let message = bodyParsed.message;
                        showTheDog(message);
                    });
                });
            })();
        } else if (option.length) {
            (async function () {
                get(`https://dog.ceo/api/breed/${option}/images/random`, (res) => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", (data) => {
                        body += data;
                    });
                    res.on("end", () => {
                        var bodyParsed = JSON.parse(body);
                        let message = bodyParsed.message;
                        showTheDog(message);
                    });
                });
            })();
        }
    }
}
