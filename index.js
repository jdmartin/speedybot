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

// Helper to sanitize cron strings
function getCron(envVar) {
    return process.env[envVar]?.trim().replace(/\r/g, '');
}

// Function to schedule all jobs once the client is ready
const dbclean = new AttendanceDatabaseCleanup();
const apiDBTools = new ApiDatabaseCleanup();

function scheduleJobsAfterReady() {
    console.log('Scheduling jobs 10s after client is ready...');

    // --- DB Cleanup ---
    const cronCleanup = getCron('CRON_DB_CLEANUP_TIME');
    const jobCleanup = scheduleJob({ rule: cronCleanup, tz: 'America/New_York' }, () => {
        console.log('DB cleanup fired at:', new Date());
        dbclean.cleanAbsences();
        dbclean.cleanMessages();
    });
    console.log('Next scheduled DB cleanup:', jobCleanup.nextInvocation()?.toString());

    // --- DB Vacuum ---
    const cronVacuum = getCron('CRON_DB_VACUUM_TIME');
    const jobVacuum = scheduleJob({ rule: cronVacuum, tz: 'America/New_York' }, () => {
        console.log('DB vacuum fired at:', new Date());
        dbclean.vacuumDatabases();
    });
    console.log('Next scheduled DB vacuum:', jobVacuum.nextInvocation()?.toString());

    // --- API DB Cleanup ---
    if (process.env.ENABLE_ATTENDANCE_API === 'true') {
        const cronApiCleanup = getCron('CRON_API_DB_CLEANUP_TIME');
        const jobApiCleanup = scheduleJob({ rule: cronApiCleanup, tz: 'America/New_York' }, () => {
            console.log('API DB cleanup fired at:', new Date());
            apiDBTools.cleanAbsences();
            apiDBTools.vacuumDatabases();
        });
        console.log('Next scheduled API DB cleanup:', jobApiCleanup.nextInvocation()?.toString());
    }

    // --- Raid Report ---
    if (process.env.RAID_DAY_REPORTS_ENABLED === 'true') {
        const cronRaid = getCron('CRON_RAID_REPORT_TIME');
        const jobRaid = scheduleJob({ rule: cronRaid, tz: 'America/New_York' }, async () => {
            console.log('Raid report triggered at:', new Date());

            const absenceDBHelper = new DataDisplayTools();
            const raidUsers = process.env.RAID_DAY_REPORTS_USERS.split(',').map(u => u.trim());

            // Wait for client to be ready
            while (!client.isReady()) {
                console.log('Discord client not ready, waiting 5s...');
                await new Promise(res => setTimeout(res, 5000));
            }

            for (const userId of raidUsers) {
                try {
                    const user = await client.users.fetch(userId);
                    const response = absenceDBHelper.summarize();
                    await user.send({ embeds: [response.absentEmbed, response.lateEmbed] });
                    console.log(`Summary sent to ${user.tag}`);
                } catch (err) {
                    console.error(`Could not send to ${userId}:`, err);
                }
            }
        });
        console.log('Next scheduled Raid report:', jobRaid.nextInvocation()?.toString());
    }
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

    console.log('Discord client ready! Waiting 10s before scheduling jobs...');
    setTimeout(scheduleJobsAfterReady, 10000);
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

//Add newcomer role to new members (helps to find and set their permissions)
if (process.env.NEWCOMER_ENABLED === 'true') {
    client.on('guildMemberAdd', async (member) => {
        try {
            const newcomerRole = member.guild.roles.cache.get(process.env.NEWCOMER_ROLE_ID);
            const welcomeChannel = member.guild.channels.cache.get(process.env.NEWCOMER_CHANNEL);

            if (newcomerRole) await member.roles.add(newcomerRole);

            if (welcomeChannel) {
                welcomeChannel.send(
                    `Welcome, <@${member.id}>! Hang tight, and we'll update your permissions shortly.`
                );
            }

            console.log(`New member joined: ${member.user.tag}`);
        } catch (error) {
            console.error('Error handling new member:', error);
        }
    });
} else {
    console.log('Newcomer role assignment is disabled.');
}

client.login(process.env.BOT_TOKEN);