const { format } = require('date-fns');
const parse = require("date-fns/parse");
const parseISO = require("date-fns/parseISO");
const isTuesday = require("date-fns/isTuesday");
const isThursday = require("date-fns/isThursday");
const isSunday = require("date-fns/isSunday");
const isValid = require("date-fns/isValid");

class dateTools {
    determineYear(month, day) {
        const today = new Date();
        const currentMonth = today.getMonth() + 0; // Not adding 1, because this is already done elsewhere.
        const currentDay = today.getDate();
        const currentYear = today.getFullYear();

        // Ensure month and day are integers
        month = parseInt(month, 10);
        day = parseInt(day, 10);

        if (month < currentMonth || (month === currentMonth && day < currentDay)) {
            // If the input date is earlier this year, return the next year
            return currentYear + 1;
        } else {
            // If the input date is today or later this year, return the current year
            return currentYear;
        }
    }

    makeFriendlyDates(date) {
        let friendlyDate = format(parseISO(date), 'iii. MMMM dd, yyyy');
        return friendlyDate;
    }

    validateRaidDate(DM, start) {
        if (start != undefined) {
            //Make sure given dates are raid dates.
            if (isValid(parse(start, "LLLL dd yyyy", new Date()))) {
                let temp_date = parse(start, "LLLL dd yyyy", new Date());
                let simple_date = temp_date.toISOString().split("T")[0];
                if (
                    isTuesday(parseISO(simple_date)) ||
                    isThursday(parseISO(simple_date)) ||
                    isSunday(parseISO(simple_date))
                ) {
                    return true;
                } else {
                    return false;
                }
            }
            //Request date in proper format.
            DM.channel.send({ content: "Sorry, I need a date in the format 'Month Day'" });
            return;
        }
    }

    validateSlashDates(start, end) {
        if (start != undefined) {
            //Make sure given dates are dates.
            if (isValid(parse(start, "LLLL dd yyyy", new Date()))) {
                let temp_date = parse(start, "LLLL dd yyyy", new Date());
                let simple_date = temp_date.toISOString().split("T")[0];
                return simple_date;
            }
            return;
        }
        if (end != undefined) {
            if (isValid(parse(end, "LLLL dd yyyy", new Date()))) {
                let temp_date = parse(end, "LLLL dd yyyy", new Date());
                let simple_date = temp_date.toISOString().split("T")[0];
                return simple_date;
            }
            return;
        }
    }
}

module.exports = {
    dateTools,
};
