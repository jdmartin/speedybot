const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const prefix = "!";

// Using Promise.catch
const catchErr = err => {
  console.log(err)
}

client.once("ready", () => { // prints "Ready!" to the console once the bot is online
    console.log("Ready!");
    client.user.setStatus("online");
    client.user.setActivity("you. | say !speedy", { type: "LISTENING"});
});


client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "speedy") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Hello!  I can help by telling you stuff. Here are some things I can do:\n\n Want the link to the logs? Type !logs\n Want a real Adventure? Type !adventure\n Why not flip a mini-wheat? Type !miniwheat\n Want something else? Ask Doolan.`);
  }

  else if (command === "logs") {
    message.reply(`Our logs are here: https://www.warcraftlogs.com/guild/reports-list/41907/`);
  }

  else if (command === "adventure") {
    message.reply(`This adventure, Speedy craves: https://quuxplusone.github.io/Advent/index.html`);
  }

  else if (command === "miniwheat") {
    let outcomes = ["frosted", "plain"];
    let outcomesIndex = Math.round(Math.random());
    message.reply(`Your mini-wheat lands on the ${outcomes[outcomesIndex]} side!`);
  }
});


client.login(config.BOT_TOKEN);
