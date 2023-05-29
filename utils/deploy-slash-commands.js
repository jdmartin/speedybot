require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync("./slash-commands").filter((file) => {
    if (process.env.enable_xmas === "false" && (file === "xmas.js" || file === "elves.js")) {
        return false; // Exclude the files if enable_xmas is false
    }
    return file.endsWith(".js"); // Include all other .js files
});
for (const file of commandFiles) {
    const command = require(`../slash-commands/${file}`);
    commands.push(command.data.toJSON());
}

const clientID = process.env.client_id;
const guildID = process.env.guild_id;

const rest = new REST({ version: "9" }).setToken(`${process.env.BOT_TOKEN}`);

class DeploySlashCommands {
    begin() {
        (async () => {
            try {
                console.log("Started refreshing application (/) commands.");

                await rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands });

                console.log("Successfully reloaded application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();
    }
}

module.exports = {
    DeploySlashCommands,
};
