//Libraries
import { ActivityType, InteractionType, MessageFlags } from "discord.js";
import { scheduleJob } from "node-schedule";
import { CreateDatabase, DatabaseTools } from "./utils/speedydb.js";
import { DataDisplayTools } from "./utils/attendance.js";

//Load helper files
import { AttendanceDatabaseCleanup, CreateAttendanceDatabase } from "./utils/attendance.js";
import { Server } from './api/listener.js';
import { ApiDatabaseCleanup } from "./api/apiAttendance.js";
import { DeploySlashCommands } from "./utils/deploy-slash-commands.js";
import { Heartbeat } from "./utils/heartbeat.js";
import { client } from "./utils/speedyutils.js";

//Load our slash commands
const slashutils = new DeploySlashCommands();
await slashutils.loadCommands();
slashutils.begin();

//Initialize the statistics database and get helper for stats:
const speedy = new CreateDatabase();
const speedyDBHelper = new DatabaseTools();
speedy.startup();

//Initialize the absences database:
new CreateAttendanceDatabase();

//Initialize the API Listener and DB (if needed)
const apiTools = new Server();
if (process.env.ENABLE_ATTENDANCE_API === "true") {
    if (process.env.API_LISTENER_TYPE === 'tcp') {
        apiTools.startHttpListener();
    } else if (process.env.API_LISTENER_TYPE === 'socket') {
        apiTools.startSocketListener();
    }
    apiTools.createDB();
}

//Database Cleanup
const dbclean = new AttendanceDatabaseCleanup();
const job = scheduleJob(process.env.CRON_DB_CLEANUP_TIME, function () {
    dbclean.cleanAbsences();
    console.log("Cleaned Attendance");
    dbclean.cleanMessages();
    console.log("Cleaned Messages");
});

//Database Vacuuming
const job_two = scheduleJob(process.env.CRON_DB_VACUUM_TIME, function () {
    dbclean.vacuumDatabases();
    console.log("Vacuumed Database");
});

//Clean apiAttendance.db, if api enabled
if (process.env.ENABLE_ATTENDANCE_API === "true") {
    const apiDBTools = new ApiDatabaseCleanup();
    const job_three = scheduleJob(process.env.CRON_API_DB_CLEANUP_TIME, function () {
        apiDBTools.cleanAbsences();
        console.log("Cleaned API Attendance");
        apiDBTools.vacuumDatabases();
        console.log("Vacuumed API DB");
    });
}

//Generate Raid-Day absence reports if enabled in .env
if (process.env.RAID_DAY_REPORTS_ENABLED === "true") {
    //Run Job on Raid Days at 20:30:01.
    const job_four = scheduleJob(process.env.CRON_RAID_REPORT_TIME, function () {
        let absenceDBHelper = new DataDisplayTools();
        // Parse the user IDs from the environment variable
        let raidDayReportUsers = process.env.RAID_DAY_REPORTS_USERS.split(',').map(userId => userId.trim());

        raidDayReportUsers.forEach(async (userId) => {
            try {
                // Fetch user object by ID
                let user = await client.users.fetch(userId.trim());

                // Get the response (e.g., embeds) for this user
                let response = absenceDBHelper.summarize();

                // Send the response as an embed to the user via DM
                await user.send({
                    embeds: [response.absentEmbed, response.lateEmbed]
                });

                console.log(`Summary sent to ${user.tag}`);
            } catch (error) {
                console.error(`Could not send message to ${userId}: `, error);
            }
        });
    })
}

//Once that's done, let's move on to main.
client.once("clientReady", () => {
    // prints "Ready!" to the console once the bot is online
    client.user.setActivity("Say /speedy", { type: ActivityType.Custom });

    //Start the heartbeat
    const heartbeat = new Heartbeat();
    if (process.env.ENABLE_HEARTBEAT_LISTENER === 'true') {
        if (process.env.HEART_TYPE === 'push') {
            heartbeat.startPushing();
        } else if (process.env.HEART_TYPE === 'socket') {
            heartbeat.startSocket();
        } else if (process.env.HEART_TYPE === 'tcp') {
            heartbeat.startHttpListener();
        }
    }
});

//Handle slash commands, which are 'interactions'
client.on("interactionCreate", async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        speedyDBHelper.slash_success(interaction.commandName);
    } catch (error) {
        console.error(error);
        speedyDBHelper.slash_error(interaction.commandName);
        return interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
    }
});

client.login(process.env.BOT_TOKEN);
