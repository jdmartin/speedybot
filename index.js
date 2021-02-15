//Load required modules
const Discord = require("discord.js");
const fs = require('fs');
//Load the config file.
const config = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Load commands into array
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Define the prefix that should precede a command.
const prefix = config.prefix;

client.once("ready", () => { // prints "Ready!" to the console once the bot is online
  console.log("Ready!");
  client.user.setStatus("online");
  client.user.setActivity("you. | say !speedy", {
    type: "LISTENING"
  });
});

//Make sure the message doesn't come from a bot.
client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)

  //If the command is not in our list of commands, try:
  if (!client.commands.has(command)) return;

  //If command is guildOnly, handle that:
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('Sorry, I can\'t execute that command inside DMs!');
  }

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(config.BOT_TOKEN);