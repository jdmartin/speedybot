const {
    SlashCommandBuilder
} = require('@discordjs/builders');

require("dotenv").config();
const utils = require("../utils/speedyutils.js");
const client = utils.client;

const sqlite3 = require('better-sqlite3');
let absencedb = new sqlite3('./db/absence.db');
var SqlString = require('sqlstring');

const dates = require("../utils/datetools.js");
const dateTools = new dates.dateTools();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('absent')
        .setDescription('Tell us you will miss raid!')
        .addStringOption(option =>
            option.setName('start_month')
            .setDescription('The starting month')
            .setRequired(true)
            .addChoice('jan', 'January')
            .addChoice('feb', 'February')
            .addChoice('mar', 'March')
            .addChoice('apr', 'April')
            .addChoice('may', 'May')
            .addChoice('jun', 'June')
            .addChoice('jul', 'July')
            .addChoice('aug', 'August')
            .addChoice('sep', 'September')
            .addChoice('oct', 'October')
            .addChoice('nov', 'November')
            .addChoice('dec', 'December'))
        .addNumberOption(option =>
            option.setName('start_date')
            .setDescription('first day of absence period')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('end_month')
            .setDescription('The ending month')
            .setRequired(true)
            .addChoice('jan', 'January')
            .addChoice('feb', 'February')
            .addChoice('mar', 'March')
            .addChoice('apr', 'April')
            .addChoice('may', 'May')
            .addChoice('jun', 'June')
            .addChoice('jul', 'July')
            .addChoice('aug', 'August')
            .addChoice('sep', 'September')
            .addChoice('oct', 'October')
            .addChoice('nov', 'November')
            .addChoice('dec', 'December'))
        .addNumberOption(option =>
            option.setName('end_date')
            .setDescription('last day of absence period')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('comment')
            .setDescription('Provide a reason (or hit enter to leave blank)')
            .setRequired(true)),

    async execute(interaction) {

        const nickname = interaction.member.nickname;
        const name = interaction.user.username;
        const start_month = interaction.options.getString('start_month');
        const start_date = interaction.options.getNumber('start_date');
        const end_month = interaction.options.getString('end_month');
        const end_date = interaction.options.getNumber('end_date');
        const comment = SqlString.escape(interaction.options.getString('comment'));

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var numericalMonth = (months.indexOf(start_month) + 1);

        const start_year = dateTools.determineYear(start_month, start_date, "");
        const end_year = dateTools.determineYear(end_month, end_date, "");

        var combinedStartDate = start_month + " " + start_date + " " + start_year;
        var endDate = dateTools.validateSlashDates(combinedStartDate);

        var absencePrep = absencedb.prepare('INSERT INTO absences(name, discord_name, start_year, start_month, start_day, end_date, comment) VALUES (?,?,round(?, 0),?,?,?,?)');
        absencePrep.run(nickname, name, start_year, numericalMonth, start_date, endDate, comment);


        interaction.reply({
            content: `You have been marked absent from ${start_month} ${start_date} until ${end_month} ${end_date}. To undo this, type \`/present ${start_month} ${start_date} ${end_month} ${end_date}\``,
            ephemeral: true
        });

        if (start_date != end_date) {
            client.channels.cache.get(`${process.env.attendance_channel}`).send(`${name} will be absent from ${start_month} ${start_date}, ${start_year} until ${end_month} ${end_date}, ${end_year}. They commented: ${comment}`);
        } else {
            client.channels.cache.get(`${process.env.attendance_channel}`).send(`${name} will be absent on ${start_month} ${start_date}, ${start_year}. They commented: ${comment}`);
        }
    },
};