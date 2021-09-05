//Load the config file.
require("dotenv").config();

//Libraries
var cron = require('node-cron');

//Load helper files
const speedydb = require("./db/speedydb.js");
const absencedb = require("./db/absencedb.js");
const utils = require("./utils/speedyutils.js");
const slash = require("./utils/deploy-slash-commands");
const heart = require("./utils/heartbeat.js");

//Get some essential variables from the helper files:
const client = utils.client;
const prefix = process.env.prefix;

//Load commands into array
const speedyutils = new utils.CreateCommandSet();
speedyutils.generateSet();

//Load our slash commands
const slashutils = new slash.DeploySlashCommands();
slashutils.begin();

//Initialize the statistics database and get helper for stats:
const speedy = new speedydb.CreateDatabase();
const speedyStats = new speedydb.GetStats();
const speedyDBHelper = new speedydb.DatabaseTools();
speedy.startup();

//Initialize the absences database:
const absence = new absencedb.CreateDatabase();
absence.startup();

//Database Cleanup
const dbclean = new absencedb.DatabaseCleanup();
cron.schedule('01 01 00 * * *', () => {
  dbclean.cleanAbsences();
  dbclean.cleanLatecomers();
});

//Once that's done, let's move on to main.
client.once("ready", () => { // prints "Ready!" to the console once the bot is online
  client.user.setStatus("online");
  client.user.setActivity("you. | say !speedy or /speedy", {
    type: "LISTENING"
  });
  console.log('Speedy Standing By!');

  //Start the heartbeat
  const heartbeat = new heart.Heartbeat();
  heartbeat.startBeating();
});

//Handle slash commands, which are 'interactions'
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
  
  const command = client.slashCommands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
    speedyDBHelper.slash_success(interaction.commandName);
	} catch (error) {
		console.error(error);
    speedyDBHelper.slash_error(interaction.commandName);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Handle prefixed commands, which come from messages.
client.on("messageCreate", message => {
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