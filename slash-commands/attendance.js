const { SlashCommandBuilder } = require("@discordjs/builders");

const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();

const absence = require("../db/absencedb-slash.js");
const absenceDBHelper = new absence.DataDisplayTools();

const attendanceTools = require("../utils/attendance-utils.js");
const attendanceHelper = new attendanceTools.attendanceTools();

const utils = require("../utils/speedyutils.js");
const client = utils.client;

module.exports = {
    data: new SlashCommandBuilder().setName("attendance").setDescription("Manage your raid attendance!"),

    async execute(interaction) {
        interaction.reply({
            content: "Ok, check your DMs and we'll do this.",
            ephemeral: true,
        });

        const user = client.users.cache.get(interaction.member.user.id);

        const name = interaction.user.username;

        const DM = await interaction.user.send({
            content: `Please choose the number that corresponds to what you want to do.\n  \n\t1. **Show/Cancel** Existing Entries\n\t2. Say You'll Be **Absent** or **Late**...\n\tQ. **Quit**`,
        });

        const collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        var response = "";

        collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let goodMenuResponses = ["1", "2", "Q"];

            if (m.author.bot === false) {
                if (!goodMenuResponses.includes(m.content.toUpperCase())) {
                    DM.channel.send({
                        content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`,
                    });
                } else if (m.content == "1") {
                    response = absenceDBHelper.show(name, "mine", "short");
                    DM.channel.send({
                        embeds: [response.absentEmbed, response.lateEmbed],
                    });
                    collector.stop("choice_one");
                } else if (m.content == "2") {
                    collector.stop("choice_two");
                } else if (m.content.toUpperCase() == "Q") {
                    collector.stop("user");
                }
            }
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: `OK, see you later!`,
                });
            } else if (reason === "choice_one") {
                if ((response.absentCount || response.lateCount) > 0) {
                    attendanceHelper.chooseOntimeOrPresent(DM, name);
                } else {
                    attendanceHelper.noAbsencesOrLateFound(DM, name);
                }
            } else if (reason === "choice_two") {
                attendanceHelper.absenceMenuCollection(DM, name);
            }
        });
    },
};
