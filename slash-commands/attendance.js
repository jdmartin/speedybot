import { ActionRowBuilder, DiscordAPIError, MessageFlags, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

import { AttendanceTools } from "../utils/attendance.js";
const attendanceHelper = new AttendanceTools();

import { dateTools } from "../utils/datetools.js";
const dateUtils = new dateTools();

function createDateString() {
    let today = new Date();
    let month = today.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month.
    let day = today.getDate();
    let dateStr = `${month}/${day}`;

    return dateStr;
}

function testDates(dateString) {
    if (dateString.length === 0) {
        return 0;  // Optional end date is not specified.
    }

    const splitArray = dateString.split("/");
    if (splitArray.length === 2) {
        const firstNumber = Number(splitArray[0]);
        const secondNumber = Number(splitArray[1]);

        // Ensure month and day are represented with two digits.
        const formattedFirstNumber = firstNumber < 10 ? `0${firstNumber}` : firstNumber;
        const formattedSecondNumber = secondNumber < 10 ? `0${secondNumber}` : secondNumber;

        if (formattedFirstNumber === "02" && formattedSecondNumber > "29") {
            return 1;  // February with an invalid day.
        }

        if (formattedFirstNumber >= "01" && formattedFirstNumber <= "12" && formattedSecondNumber >= "01" && formattedSecondNumber <= "31") {
            return 0;  // Valid date.
        }
    }
    return 1;  // Guard value for invalid input.
}


function testAttendanceInput(attendanceActionTest, attendanceRecurringTest, startDate, endDate) {
    const validActions = ['a', 'c', 'l'];
    const validRecurringChoices = ['r', 's', 't'];
    let resultOfTests = 0;
    let testFailureReasons = "";

    // Validate the user's action choice
    if (!validActions.includes(attendanceActionTest)) {
        resultOfTests += 1;
        testFailureReasons += 'The action (box 1) isn\'t correct. Please try again with **a**, **c**, or **l**.\n';
    }

    // Validate the user's recurring choice
    if (attendanceRecurringTest && !validRecurringChoices.includes(attendanceRecurringTest)) {
        resultOfTests += 1;
        testFailureReasons += 'The recurring choice (box 5) isn\'t correct. Please try again with **r**, **s**, or **t**.\n';
    }

    if (!testDates(startDate) == 0) {
        resultOfTests += 1;
        testFailureReasons += 'Check your start date is valid. It should be in the format M/D. Ex: 11/1\n';
    }

    if (!testDates(endDate) == 0) {
        resultOfTests += 1;
        testFailureReasons += 'Check your end date is valid. It should be in the format M/D. Ex: 11/1\n';
    }

    if (resultOfTests > 0) {
        testFailureReasons += '\nPlease use `/attendance` again. You can fix your existing answers for a couple minutes more...\n'
    }

    return { resultOfTests, testFailureReasons };
}

function prepareDateForProcessing(givenDate) {
    let date_parts = [];

    if (givenDate) {
        let extracted_values = givenDate.split('/');
        let month = Number(extracted_values[0] - 1);
        let month_for_human_date = Number(extracted_values[0]);
        let day = Number(extracted_values[1]);
        let year = dateUtils.determineYear(month, day);

        // Define a mapping function to format single-digit values as two-digit strings
        const formatAsTwoDigits = (value) => value < 10 ? `0${value}` : value;
        // Apply the mapping function to month and day
        let formattedMonth = formatAsTwoDigits(month);
        let formattedDay = formatAsTwoDigits(day);
        let formattedHumanMonth = formatAsTwoDigits(month_for_human_date);

        let the_date = year + "-" + formattedHumanMonth + "-" + formattedDay
        date_parts.push(year, formattedMonth, formattedDay, the_date);
        return date_parts
    }
    else {
        return givenDate
    }
}

export const data = new SlashCommandBuilder().setName("attendance").setDescription("Attendance Manager");
export async function execute(interaction) {
    const uniqueCustomId = `attendanceModal_${interaction.user.id}_${Date.now()}`;
    const modal = new ModalBuilder().setCustomId(uniqueCustomId).setTitle("Attendance!");

    // Create a placeholder date string:
    let todayDatestring = createDateString();
    // Gather and display known absences in the placeholder for comments:
    let knownAbsences = "You can let us know why, if needed, here.";
    // Create the text input components
    const attendanceActionInput = new TextInputBuilder()
        .setCustomId("attendanceActionInput")
        // The label is the prompt the user sees for this input
        .setLabel("Mark? (a)bsent, (l)ate, (c)ancel existing")
        // Set placeholder
        .setPlaceholder("a, c, or l")
        .setMinLength(1)
        .setMaxLength(1)
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short)
        // This is a required value
        .setRequired(true);

    const startDateInput = new TextInputBuilder()
        .setCustomId("startDateInput")
        .setLabel("Enter the Start Date: Month/Day")
        .setMinLength(3)
        .setMaxLength(5)
        .setPlaceholder(`Ex: Today is ${todayDatestring}`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const commentInput = new TextInputBuilder()
        .setCustomId("commentInput")
        .setLabel("(Optional) Anything we should know?")
        .setPlaceholder(`${knownAbsences}`)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    const endDateInput = new TextInputBuilder()
        .setCustomId("endDateInput")
        .setLabel("(Optional) Recurring? Enter an End Date:")
        .setMinLength(3)
        .setMaxLength(5)
        .setPlaceholder(`Ex: Today is ${todayDatestring}`)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const recurringInput = new TextInputBuilder()
        .setCustomId("recurringInput")
        .setLabel("(Optional) Limit to: (t)ues, thu(r)s, (s)un")
        .setPlaceholder("r, s, or t")
        .setMinLength(0)
        .setMaxLength(1)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const actionActionRow = new ActionRowBuilder().addComponents(attendanceActionInput);
    const startDateActionRow = new ActionRowBuilder().addComponents(startDateInput);
    const commentActionRow = new ActionRowBuilder().addComponents(commentInput);
    const endDateActionRow = new ActionRowBuilder().addComponents(endDateInput);
    const recurringActionRow = new ActionRowBuilder().addComponents(recurringInput);

    // Add inputs to the modal
    modal.addComponents(actionActionRow, startDateActionRow, commentActionRow, endDateActionRow, recurringActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);

    try {
        const filter = (interaction) => interaction.customId === uniqueCustomId;
        const collectedInteraction = await interaction.awaitModalSubmit({ filter, time: 300000 });

        if (collectedInteraction) {
            const attendanceAction = collectedInteraction.fields.getTextInputValue("attendanceActionInput").toLowerCase();
            const attendanceStart = collectedInteraction.fields.getTextInputValue("startDateInput");
            const attendanceComment = collectedInteraction.fields.getTextInputValue("commentInput");
            const attendanceEnd = collectedInteraction.fields.getTextInputValue("endDateInput");
            const attendanceRecurring = collectedInteraction.fields.getTextInputValue("recurringInput").toLowerCase();

            // Validate the user's inputs
            let { resultOfTests, testFailureReasons } = testAttendanceInput(attendanceAction, attendanceRecurring, attendanceStart, attendanceEnd);

            if (resultOfTests > 0) {
                await interaction.followUp({
                    content: testFailureReasons,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                let username = '';
                let nickname = '';
                let comment = "";
                let restriction = "none";

                username = interaction.user.username;
                nickname = interaction.member.nickname;

                if (attendanceComment.length > 0) {
                    comment = attendanceComment;
                }

                if (attendanceRecurring) {
                    restriction = attendanceRecurring;
                }

                // Handle given values
                let start_date = prepareDateForProcessing(attendanceStart);
                let processed_end_date = prepareDateForProcessing(attendanceEnd);
                let start_year = start_date[0];
                let start_month = start_date[1];
                let start_day = start_date[2];
                let full_start_date = start_date[3];
                let end_year = processed_end_date[0];
                let end_month = processed_end_date[1];
                let end_day = processed_end_date[2];
                let full_end_date = processed_end_date[3];

                // We still need something if the user chose a single date, because of later checks.
                if (typeof full_end_date === 'undefined') {
                    full_end_date = full_start_date;
                    end_year = start_year;
                    end_month = start_month;
                    end_day = start_day;
                }

                switch (attendanceAction) {
                    case "a":
                        attendanceHelper.processDBUpdate(username, nickname, "absent", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day);
                        attendanceHelper.generateResponse(username, nickname, "absent", full_start_date, full_end_date, comment, restriction);
                        break;
                    case "l":
                        attendanceHelper.processDBUpdate(username, nickname, "late", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day);
                        attendanceHelper.generateResponse(username, nickname, "late", full_start_date, full_end_date, comment, restriction);
                        break;
                    case "c":
                        // The reason for full_start_date is that each date in a range gets converted to a single date, 
                        // so the 'end_date' is actually the same as the start_date.
                        attendanceHelper.processDBUpdate(username, nickname, "cancel", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day);
                        attendanceHelper.removeSpeedyMessage(username, full_start_date, full_end_date);
                        break;
                }

                await collectedInteraction.reply({
                    content: "Ok. Take care! 🐢",
                    flags: MessageFlags.Ephemeral
                }).catch(error => {
                    console.error(error);
                });
            }
        }
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === 10062) {
            console.log("User likely didn't finish. Caught 'Unknown Interaction' error.");
        }
        else if (error.code === 'InteractionAlreadyReplied') {
            console.log(`${interaction.user.tag} already replied.`);
        }
        else if (error.code === 'InteractionCollectorError') {
            console.log(`${interaction.user.tag} timed out.`);
        } else {
            console.error(error);
        }
    }
}