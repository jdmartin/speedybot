//Load required modules
const Discord = require("discord.js");
const fs = require('fs');
const sqlite3 = require('sqlite3');

//Load the config file.
require("dotenv").config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Define the prefix that should precede a command.
const prefix = process.env.prefix;

//Load commands into array
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Initialize the statistics database:
const db = new sqlite3.Database(':memory:');

db.serialize(function () {
  db.run("CREATE TABLE `commands` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `count` INT, `errors` INT)");

  var stmt = db.prepare("INSERT INTO `commands` (`name`, `count`, `errors`) VALUES (?, 0, 0)");
  commandFiles.forEach(name => {
    var thisCommand = name.split(".", 1);
    stmt.run(thisCommand);
  })
  stmt.finalize();
});

//Once that's done, let's move on to main.
client.once("ready", () => { // prints "Ready!" to the console once the bot is online
  client.user.setStatus("online");
  client.user.setActivity("you. | say !speedy", {
    type: "LISTENING"
  });
  console.log('Speedy Standing By!');
});

client.on("message", function (message) {
  //Make sure the message doesn't come from a bot.
  if (message.author.bot) return;
  //Make sure the message starts with the prefix.
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  //If the command is xzzyz (for stats):
  if (command === 'xyzzy') {
    let sql = `SELECT DISTINCT Name name, Count count, Errors errors FROM commands ORDER BY count DESC`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      const embed = new Discord.MessageEmbed()
        .setColor(0xFFFFFF)
        .setTitle("Usage stats since last launch")
        .setFooter("These statistics are a product of the Inifite Speedyflight. Use Wisely.")
      rows.forEach((row) => {
        embed.addFields({
          name: row.name,
          value: "\t\tCount: " + row.count + "\t\tErrors " + row.errors,
          inline: true
        })
      });
      if (message.channel.type === 'dm') {
        message.channel.send(embed);
      } else {
        message.member.send(embed);
      }
    }, )
  };

  //If the command is not in our list of commands...
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
    db.run('UPDATE commands SET count = count + 1 WHERE name = (?)', [command]);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
    db.run('UPDATE commands SET errors = errors + 1 WHERE name = (?)', [command]);
  }
});

client.login(process.env.BOT_TOKEN);