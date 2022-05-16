require("dotenv").config();
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed} = require("discord.js");
const myIntents = new Intents();
myIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_PRESENCES, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
    Intents.FLAGS.GUILD_WEBHOOKS, 
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS);
const client = new Client({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const commands = [];
const commandFiles = fs.readdirSync(require('path').resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
client.commands = new Collection();

const slashCommands = [];
const slashCommandFiles = fs.readdirSync(require('path').resolve(__dirname, '../slash-commands')).filter(file => file.endsWith('.js'));
client.slashCommands = new Collection();

class CreateCommandSet {
    generateSet() {
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }
        for (const file of slashCommandFiles) {
            const command = require(`../slash-commands/${file}`);
            client.slashCommands.set(command.data.name, command);
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

module.exports = {
    client: client,
    commands: commands,
    commandFiles: commandFiles,
    slashCommands: slashCommands,
    slashCommandFiles: slashCommandFiles,
    CreateCommandSet,
    SpeedyTools
};