const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync("./slash-commands").filter((file) => {
    return file.endsWith(".js"); // Include all other .js files
});
for (const file of commandFiles) {
    const command = require(`../slash-commands/${file}`);
    commands.push(command.data.toJSON());
}

class DeploySlashCommands {
    constructor() {
        this.clientID = process.env.client_id;
        this.guildID = process.env.guild_id;
        this.rest = new REST({ version: "9" }).setToken(`${process.env.BOT_TOKEN}`);
    }

    begin() {
        (async () => {
            try {
                console.log("Started refreshing application (/) commands.");

                await this.rest.put(Routes.applicationGuildCommands(this.clientID, this.guildID), { body: commands });

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
