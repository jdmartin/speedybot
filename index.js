const Discord = require("discord.js");
const fs = require('fs');
const config = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const prefix = "!";

client.once("ready", () => { // prints "Ready!" to the console once the bot is online
    console.log("Ready!");
    client.user.setStatus("online");
    client.user.setActivity("you. | say !speedy", { type: "LISTENING"});
});

if (!client.commands.has(command)) return;

try {
	client.commands.get(command).execute(message, args);
} catch (error) {
	console.error(error);
	message.reply('there was an error trying to execute that command!');
}

client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "speedy") {
    client.commands.get('speedy').execute(message, args);
  } else if (command === "logs") {
    client.commands.get('logs').execute(message, args);
  } else if (command === "adventure") {
    client.commands.get('adventure').execute(message, args);
  } else if (command === "miniwheat") {
    client.commands.get('miniwheat').execute(message, args);
  }
});


client.login(config.BOT_TOKEN);
