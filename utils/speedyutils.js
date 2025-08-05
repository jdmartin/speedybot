import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const myIntents = [
    GatewayIntentBits.Guilds,
];

const myPartials = [Partials.Channel, Partials.Message, Partials.Reaction];

const client = new Client({
    intents: myIntents,
    partials: myPartials,
});

const slashCommands = [];
const slashCommandsDir = join(__dirname, '..', 'slash-commands');
const slashCommandFiles = readdirSync(slashCommandsDir).filter((file) =>
    file.endsWith('.js')
);
client.slashCommands = new Collection();

class CreateCommandSet {
    async generateSet() {
        for (const file of slashCommandFiles) {
            const commandModule = await import(`../slash-commands/${file}`);
            client.slashCommands.set(commandModule.data.name, commandModule);
        }
    }
}

class SpeedyTools {
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }
}

export { client, CreateCommandSet, slashCommands, slashCommandFiles, SpeedyTools };
