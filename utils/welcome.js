import { EmbedBuilder } from "discord.js";
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// Equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = resolve(__dirname, "../db");
const dbPath = join(dbDir, "welcome.db");

// Ensure db directory exists
if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
}

//DB
class CreateWelcomeDatabase {
    constructor() {
        this.newcomersdb = new DatabaseSync(dbPath);
        this.startup();
    }

    startup() {
        try {
            this.newcomersdb.exec('BEGIN');
            try {
                // newcomers table
                this.newcomersdb.exec(`
                    CREATE TABLE IF NOT EXISTS newcomers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        date TEXT DEFAULT (datetime('now')),
                        name TEXT,
                        discord_name TEXT NOT NULL,
                        in_game_name TEXT,
                        how_found TEXT,
                        comment TEXT
                    )
                `);

                this.newcomersdb.exec('COMMIT');
            } catch (err) {
                this.newcomersdb.exec('ROLLBACK');
                throw err;
            }

            console.log("Welcome database initialized successfully.");
        } catch (err) {
            console.error("Error initializing welcome database:", err);
            throw err; // Let it crash loudly so you notice
        }
    }
}

class WelcomeTools {
    constructor() {
        this.newcomersdb = new DatabaseSync(dbPath);
    }

    addNewcomer(discord_name, name, in_game_name, how_found, comment) {
        if (discord_name === null) {
            discord_name = name;
        }
        var newcomerPrep = this.newcomersdb.prepare(
            "INSERT INTO newcomers (date, name, discord_name, in_game_name, how_found, comment) VALUES (?, ?, ?, ?, ?, ?);",
        );
        const currentDate = new Date().toISOString();
        newcomerPrep.run(currentDate, name, discord_name, in_game_name, how_found, comment);
    }
}

class WelcomeDataDisplayTools {
    constructor() {
        this.newcomersdb = new DatabaseSync(dbPath);
    }

    async showPending(interaction) {
        const newcomerRoleId = process.env.NEWCOMER_ROLE_ID;
        const guild = interaction.guild;

        // Pull the most recent 20 entries to check against active roles
        const sql = this.newcomersdb.prepare("SELECT * FROM newcomers ORDER BY id DESC LIMIT 20");
        const newcomersResults = sql.all();

        const newcomersEmbed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle("Pending Newcomers (Needs Role Set)")
            .setFooter({
                text: "Showing up to 10 users who still possess the newcomer role.",
            });

        const pendingNewcomers = [];

        for (const row of newcomersResults) {
            // Stop once we have collected 10 filtered users
            if (pendingNewcomers.length >= 10) break;

            try {
                // Try to find the member in the guild cache or fetch them using discord_name/tag or ID if stored
                // Note: If row.discord_name stores user.tag or username, we look them up. 
                // Alternatively, storing discord_id in the database makes this 100% bulletproof!
                let member = guild.members.cache.find(m => m.user.tag === row.discord_name || m.user.username === row.name);

                if (!member && row.discord_name) {
                    // Fallback to fetch if not cached
                    const fetchedMembers = await guild.members.fetch({ query: row.discord_name, limit: 1 });
                    member = fetchedMembers.first();
                }

                // If the member is found and still has the newcomer role, keep them in the list
                if (member && newcomerRoleId && member.roles.cache.has(newcomerRoleId)) {
                    pendingNewcomers.push({ row, member });
                }
            } catch (err) {
                console.error(`Could not verify roles for newcomer entry ${row.name}:`, err);
            }
        }

        if (pendingNewcomers.length === 0) {
            newcomersEmbed.setDescription("No pending newcomers found with the active newcomer role!");
        } else {
            pendingNewcomers.forEach(({ row }) => {
                let commentString = "";
                if (row.comment && row.comment.length > 0) {
                    commentString = `\nComments: ${row.comment}`;
                }

                const cleanDate = row.date ? row.date.substring(0, 10) : 'Unknown';

                newcomersEmbed.addFields({
                    name: `${row.name} (Joined: ${cleanDate})`,
                    value: `Discord: ${row.discord_name}\nIn-Game: ${row.in_game_name || 'N/A'}\nFound via: ${row.how_found || 'N/A'}${commentString}`,
                    inline: false,
                });
            });
        }

        return { newcomersEmbed };
    }
}

export { WelcomeTools, CreateWelcomeDatabase, WelcomeDataDisplayTools };
