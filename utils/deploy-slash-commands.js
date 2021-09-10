require("dotenv").config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./slash-commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../slash-commands/${file}`);
	commands.push(command.data.toJSON());
}

const clientID = process.env.client_id;
const guildID = process.env.guild_id;

const rest = new REST({ version: '9' }).setToken(`${process.env.BOT_TOKEN}`);

class DeploySlashCommands {
	begin() {
		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');
		
				 await rest.put(
					 Routes.applicationGuildCommands( clientID, guildID ),
					 { body: commands },
				 );
		
				console.log('Successfully reloaded application (/) commands.');
			} catch (error) {
				console.error(error);
			}
		})();
	}
}

module.exports = {
	DeploySlashCommands
}
