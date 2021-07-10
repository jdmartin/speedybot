require("dotenv").config();
const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(require('path').resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));

class CreateCommandSet {
    generateSet() {
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }
    }
}

class NameTools {
    getGuildData(message) {
        const guild = client.guilds.cache.get(`${process.env.guild_id}`);
        return guild.members.fetch(message.author.id);
    }

    getNickname(message) {
        //Grab that nickname
        if (message.channel.type != 'dm') {
            return (message.nickname);
        }
        if (message.channel.type === 'dm') {
            return ("[Capt. Placeholder]");
        }
    }
}

module.exports = {
    client: client,
    commandFiles: commandFiles,
    CreateCommandSet,
    NameTools
};