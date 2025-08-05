import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REST, Routes } from 'discord.js';
import { client } from '../utils/speedyutils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const commands = [];
const commandFiles = readdirSync(join(__dirname, '../slash-commands')).filter((file) => {
    return file.endsWith(".js"); // Include all other .js files
});
for (const file of commandFiles) {
    const commandModule = await import(`../slash-commands/${file}`);
    commands.push(commandModule.data.toJSON());
}

class DeploySlashCommands {
    constructor() {
        this.clientID = process.env.CLIENT_ID;
        this.guildID = process.env.GUILD_ID;
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

    async loadCommands() {
        client.slashCommands = new Map();

        const commandsPath = join(process.cwd(), 'slash-commands');
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = join(commandsPath, file);
            const command = await import(filePath);

            if (!command.data || !command.execute) {
                console.warn(`[WARNING] Command at ${file} missing data or execute.`);
                continue;
            }

            client.slashCommands.set(command.data.name, command);
        }

        console.log(`Loaded ${client.slashCommands.size} commands.`);
    }
}

export { DeploySlashCommands };
