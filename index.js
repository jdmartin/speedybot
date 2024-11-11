//Libraries
const schedule = require("node-schedule");

//Load helper files
const speedydb = require("./utils/speedydb.js");
const attendancedb = require("./utils/attendance.js");
const apiUtils = require("./api/listener.js");
const apiDBUtils = require("./api/apiAttendance.js");
const utils = require("./utils/speedyutils.js");
const slash = require("./utils/deploy-slash-commands");
const heart = require("./utils/heartbeat.js");
const { ActivityType, InteractionType, time } = require("discord.js");

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

//Initialize the API Listener and DB (if needed)
const apiTools = new apiUtils.Server();
if (process.env.enable_attendance_api === "true") {
    apiTools.startListening();
    apiTools.createDB();
}

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

//Clean apiAttendance.db, if api enabled
if (process.env.enable_attendance_api === "true") {
    const apiDBTools = new apiDBUtils.DatabaseCleanup();
    const job_three = schedule.scheduleJob("01 01 04 * * *", function () {
        apiDBTools.cleanAbsences();
        console.log("Cleaned API Attendance");
        apiDBTools.vacuumDatabases();
        console.log("Vacuumed API DB");
    });
}

//Generate Raid-Day absence reports if enabled in .env
if (process.env.raid_day_reports_enabled === "true") {
    //Run Job on Raid Days at 20:30:01.
    const job_four = schedule.scheduleJob("01 00 21 * * 0,2,4", function () {
        let absence = require("./utils/attendance.js");
        let absenceDBHelper = new absence.DataDisplayTools();
        // Parse the user IDs from the environment variable
        let raidDayReportUsers = process.env.raid_day_reports_users.split(',').map(userId => userId.trim());

        raidDayReportUsers.forEach(async (userId) => {
            try {
                // Fetch user object by ID
                let user = await client.users.fetch(userId.trim());

                // Get the response (e.g., embeds) for this user
                let response = absenceDBHelper.show(user.username, "today");

                // Send the response as an embed to the user via DM
                await user.send({
                    embeds: [response.absentEmbed, response.lateEmbed, response.apiEmbed]
                });

                console.log(`Summary sent to ${user.tag}`);
            } catch (error) {
                console.error(`Could not send message to ${userId}: `, error);
            }
        });
    })
}

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
