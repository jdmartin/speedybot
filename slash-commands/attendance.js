const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const absence = require("../db/absencedb-slash.js");
const absenceDBHelper = new absence.DataDisplayTools();

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
        })
        const user = client.users.cache.get(interaction.member.user.id);

        const name = interaction.user.username;

        const DM = await interaction.user.send({
            content: `This is where the menu embed will go.`
        });

        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', 'cancel'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                let response = absenceDBHelper.show(name, 'mine');
                DM.channel.send({
                    embeds: [response.absentEmbed, response.lateEmbed]
                });
            } else if (m.content == '2') {
                DM.channel.send({
                    content: "You pressed 2!"
                });
            } else if (m.content == 'cancel') {
                collector.stop();
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            } else if (reason === 'user') {
                DM.channel.send({
                    content: `OK, aborting...`
                });
            }
        })
    }
}
