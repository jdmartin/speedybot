const {
    SlashCommandBuilder
} = require('@discordjs/builders');

require("dotenv").config();

const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();

const absence = require("../db/absencedb-slash.js");
const absenceTools = new absence.AttendanceTools();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('absent')
        .setDescription('Tell us you will miss raid!')
        .addStringOption(option =>
            option.setName('start_month')
            .setDescription('The starting month')
            .setRequired(true)
            .addChoices(
                {name: 'jan', value: 'January'},
                {name: 'feb', value: 'February'},
                {name: 'mar', value: 'March'},
                {name: 'apr', value: 'April'},
                {name: 'may', value: 'May'},
                {name: 'jun', value: 'June'},
                {name: 'jul', value: 'July'},
                {name: 'aug', value: 'August'},
                {name: 'sep', value: 'September'},
                {name: 'oct', value: 'October'},
                {name: 'nov', value: 'November'},
                {name: 'dec', value: 'December'},
            )
        )
        .addIntegerOption(option =>
            option.setName('start_date')
            .setDescription('first day of absence period')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('end_month')
            .setDescription('The ending month')
            .setRequired(true)
            .addChoices(
                {name: 'jan', value: 'January'},
                {name: 'feb', value: 'February'},
                {name: 'mar', value: 'March'},
                {name: 'apr', value: 'April'},
                {name: 'may', value: 'May'},
                {name: 'jun', value: 'June'},
                {name: 'jul', value: 'July'},
                {name: 'aug', value: 'August'},
                {name: 'sep', value: 'September'},
                {name: 'oct', value: 'October'},
                {name: 'nov', value: 'November'},
                {name: 'dec', value: 'December'},
            )
        )
        .addIntegerOption(option =>
            option.setName('end_date')
            .setDescription('last day of absence period')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('comment')
            .setDescription('Reason? Can be very short, but not blank.')
            .setRequired(true)),

    async execute(interaction) {

        const nickname = interaction.member.nickname;
        const name = interaction.user.username;
        const start_month = interaction.options.getString('start_month');
        const start_date = interaction.options.getInteger('start_date');
        const end_month = interaction.options.getString('end_month');
        const end_date = interaction.options.getInteger('end_date');
        const comment = interaction.options.getString('comment');

        const start_year = dateTools.determineYear(start_month, start_date, "");
        const end_year = dateTools.determineYear(end_month, end_date, "");

        var combinedStartDate = start_month + " " + start_date + " " + start_year;
        var combinedEndDate = end_month + " " + end_date + " " + end_year;
        var startDate = dateTools.validateSlashDates(combinedStartDate);
        var endDate = dateTools.validateSlashDates(combinedEndDate);

        if ((dateTools.validateGivenDate(combinedStartDate)) && (dateTools.validateGivenDate(combinedEndDate))) {
            absenceTools.processDBUpdate(name, nickname, "absent", startDate, endDate, comment);
            absenceTools.generateResponse(name, "absent", startDate, endDate, comment);

            if (startDate == endDate) {
                interaction.reply({
                    content: `You have been marked absent on ${start_month} ${start_date}. To undo this, type \`/present ${start_month} ${start_date}\``,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `You have been marked absent from ${start_month} ${start_date} until ${end_month} ${end_date}. To undo this, type \`/present ${start_month} ${start_date} ${end_month} ${end_date}\``,
                    ephemeral: true
                });
            }
        } else {
            interaction.reply({
                content: "Sorry, one of the dates isn't quite right. Please check and try again (or complain to Doolan)",
                ephemeral: true
            })
        }
    },
};