const { format, parseISO } = require('date-fns');

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

    isTuesday(date) {
        // Ensure that 'date' is a valid Date object
        if (!(date instanceof Date)) {
            throw new Error('Invalid input');
        }

        // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const dateDayOfWeek = date.getDay();

        // Check if the date's day of the week is Tuesday (2)
        return dateDayOfWeek === 2;
    }

    isThursday(date) {
        // Ensure that 'date' is a valid Date object
        if (!(date instanceof Date)) {
            throw new Error('Invalid input');
        }

        // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const dateDayOfWeek = date.getDay();

        // Check if the date's day of the week is Thursday (4)
        return dateDayOfWeek === 4;
    }

    isSunday(date) {
        // Ensure that 'date' is a valid Date object
        if (!(date instanceof Date)) {
            throw new Error('Invalid input');
        }

        // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const dateDayOfWeek = date.getDay();

        // Check if the date's day of the week is Sunday (0)
        return dateDayOfWeek === 0;
    }

    makeFriendlyDates(date) {
        let friendlyDate = format(parseISO(date), 'iii. MMMM dd, yyyy');
        return friendlyDate;
    }
}

module.exports = {
    dateTools,
};
