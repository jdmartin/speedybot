const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();

const absence = require("../db/absencedb-slash.js");
const absenceDBHelper = new absence.DataDisplayTools();

const attendanceTools = require("../utils/attendance-utils.js");
const attendanceHelper = new attendanceTools.attendanceTools();

const utils = require("../utils/speedyutils.js");
const client = utils.client;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attendance')
        .setDescription('Manage your raid attendance!'),

    async execute(interaction) {
        interaction.reply({
            content: "Ok, check your DMs and we'll do this.",
            ephemeral: true
        });

        const user = client.users.cache.get(interaction.member.user.id);

        const name = interaction.user.username;

        const DM = await interaction.user.send({
            content: `Please choose the number that corresponds to what you want to do.\n  \n\t1. Show/Cancel Existing Entries\n\t2. Add an Absence or say you will be Late...\n\t4. Quit`
        });

        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', '4'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                let response = absenceDBHelper.show(name, 'mine');
                DM.channel.send({
                    embeds: [response.absentEmbed, response.lateEmbed]
                });
                collector.stop('choice_one');
            } else if (m.content == '2') {
                collector.stop('choice_two');
            } else if (m.content == '4') {
                collector.stop('user');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            } else if (reason === 'user') {
                DM.channel.send({
                    content: `OK, see you later!`
                });
            } else if (reason === 'choice_one') {
                attendanceHelper.chooseOntimeOrPresent(DM);
            } else if (reason === 'choice_two') {
                attendanceHelper.absenceMenuCollection(DM);
            } 
        })
    }
}
