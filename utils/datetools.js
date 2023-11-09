const { format } = require('date-fns');
const parseISO = require("date-fns/parseISO");

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
}

module.exports = {
    dateTools,
};
