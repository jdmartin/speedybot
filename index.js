//Libraries
const schedule = require("node-schedule");

//Load helper files
const speedydb = require("./utils/speedydb.js");
const attendancedb = require("./utils/attendance.js");
const utils = require("./utils/speedyutils.js");
const slash = require("./utils/deploy-slash-commands");
const heart = require("./utils/heartbeat.js");
const { ActivityType, InteractionType } = require("discord.js");

//Get some essential variables from the helper files:
const client = utils.client;

//Load commands into array
const speedyutils = new utils.CreateCommandSet();
speedyutils.generateSet();

//Load our slash commands
const slashutils = new slash.DeploySlashCommands();
slashutils.begin();

//Initialize the statistics database and get helper for stats:
const speedy = new speedydb.CreateDatabase();
const speedyDBHelper = new speedydb.DatabaseTools();
speedy.startup();

//Initialize the absences database:
const attendance = new attendancedb.CreateDatabase();
attendance.startup();

//Database Cleanup
const dbclean = new attendancedb.DatabaseCleanup();
const job = schedule.scheduleJob("01 01 01 * * * ", function () {
    dbclean.cleanAbsences();
    console.log("Cleaned Attendance");
    dbclean.cleanMessages();
    console.log("Cleaned Messages");
});

//Database Vacuuming
const job_two = schedule.scheduleJob("02 01 03 * * *", function () {
    dbclean.vacuumDatabases();
    console.log("Vacuumed Database");
});

//Once that's done, let's move on to main.
client.once("ready", () => {
    // prints "Ready!" to the console once the bot is online
    client.user.setActivity("Say /speedy", { type: ActivityType.Custom });

    //Start the heartbeat
    const heartbeat = new heart.Heartbeat();
    if (process.env.heart_type === 'push') {
        heartbeat.startPushing();
    } else if (process.env.heart_type === 'socket') {
        heartbeat.startSocket();
    }
});

//Handle slash commands, which are 'interactions'
client.on("interactionCreate", async (interaction) => {
    if (!interaction.type === InteractionType.ApplicationCommand) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        speedyDBHelper.slash_success(interaction.commandName);
    } catch (error) {
        console.error(error);
        speedyDBHelper.slash_error(interaction.commandName);
        return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});

client.login(process.env.BOT_TOKEN);
