//Load the config file.
require("dotenv").config();

//Load helper files
const speedydb = require("./db/speedydb.js");
const absencedb = require("./db/absencedb.js");
const utils = require("./utils/speedyutils.js");
const heart = require("./utils/heartbeat.js");

//Get some essential variables from the helper files:
const client = utils.client;
const prefix = process.env.prefix;

//Load commands into array
const speedyutils = new utils.CreateCommandSet();
speedyutils.generateSet();

//Initialize the statistics database and get helper for stats:
const speedy = new speedydb.CreateDatabase();
const speedyStats = new speedydb.GetStats();
const speedyDBHelper = new speedydb.DatabaseTools();
speedy.startup();

//Initialize the absences database:
const absence = new absencedb.CreateDatabase();
absence.startup();

//Once that's done, let's move on to main.
client.once("ready", () => { // prints "Ready!" to the console once the bot is online
  client.user.setStatus("online");
  client.user.setActivity("you. | say !speedy", {
    type: "LISTENING"
  });
  console.log('Speedy Standing By!');

  //Start the heartbeat
  const heartbeat = new heart.Heartbeat();
  heartbeat.startBeating();
});

client.on("message", message => {
  //Make sure the message doesn't come from a bot.
  if (message.author.bot) return;
  //Make sure the message starts with the prefix.
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  //If the command is xzzyz (for stats):
  if (command === 'xyzzy') {
    speedyStats.retrieve(message);
  }

  //Placeholder shortcut for !help -- TODO
  if (command === 'help') {
    try {
      client.commands.get(command).execute(message, args);
      speedyDBHelper.success(command);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
      speedyDBHelper.error(command);
    }
  }

  //If the command is not in our list of commands...
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
    speedyDBHelper.success(command);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
    speedyDBHelper.error(command);
  }
});

client.login(process.env.BOT_TOKEN);