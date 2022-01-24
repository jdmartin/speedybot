var parse = require('date-fns/parse');
var isValid = require('date-fns/isValid');
var format = require('date-fns/format');

const offset = 'T11:52:29.478Z';

class dateTools {
    checkIsDate(a, b, c) {
        if (parse(a, 'LLLL', new Date())) { //Month Check
            if (parse(b, 'dd', new Date())) { //Day Check
                if ((parse(c, 'yyyy', new Date()))) { //Year Check 
                    return (true);
                }
            }
        } else {
            return (false);
        }
    }

    checkIsDayOfMonth(day) {
        if (day >= 1 && day <= 31) {
            return (true);
        }
        else {
            return (false);
        }
    }

    checkIsMonth(a) {
        if (isValid(parse(a, 'LLLL', new Date()))) {
            return (true);
        } else {
            return (false);
        }
    }

    determineMonth(monthName, day, year) {
        //Get number of given month and given date for later comparison
        var g = Date.parse(monthName + day, year);
        var gMonth = new Date(g).getMonth();
        //Format Date 
        return(gMonth);
    }

    determineYear(month, day) {
        //Create date object in GMT-5
        var d = new Date(new Date() - 3600 * 1000 * 5);
        //Set current year, month
        let year = d.getFullYear();
        let monNum = d.getMonth();
        let date = d.getDate();
        //Get number of given month and given date for later comparison
        var g = Date.parse(month + day, year);
        var gMonth = new Date(g).getMonth();
        var gDate = new Date(g).getDate();
        //If month is equal to or after this month: return this year.
        if (gMonth > monNum) {
            return (year);
        }
        //If month is before this month: return next year.
        if (gMonth < monNum) {
            return (year + 1);
        }
        //If it's this month, check if date is before, equal, or after today.
        if (gMonth == monNum) {
            if (gDate < date) {
                return (year + 1);
            }
            if (gDate >= date) {
                return (year);
            }
        }
    }

    getCurrentYear() {
        //Create date object in GMT-5
        var d = new Date(new Date() - 3600 * 1000 * 5);
        //Set current year and return it.
        let year = d.getFullYear();
        return (year);
    }

    makeFriendlyDates(date) {
        //Ensures that dates are in the appropriate time zone (locally) by adding an ugly ISO timestamp.
        let friendlyDateTemp = date + offset;
        let friendlyDate = format(new Date(friendlyDateTemp), 'iii. MMMM dd, yyyy');
        return (friendlyDate)
    }

    validateDates(message, start, end) {
        if (start != undefined) {
            //Make sure given dates are dates.
            if ((isValid(parse(start, 'LLLL dd yyyy', new Date())))) {
                let temp_date = parse(start, 'LLLL dd yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            //Request date in proper format.
            message.reply("Sorry, I need a start date in the format 'Month Day'");
            return;
        }
        if (end != undefined) {
            if ((isValid(parse(end, 'LLLL dd yyyy', new Date())))) {
                let temp_date = parse(end, 'LLLL dd yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            message.reply("Sorry, I need an end date in the format 'Month Day'.");
            return;
        }
    }

    validateSlashDates(start, end) {
        if (start != undefined) {
            //Make sure given dates are dates.
            if ((isValid(parse(start, 'LLLL dd yyyy', new Date())))) {
                let temp_date = parse(start, 'LLLL dd yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            return;
        }
        if (end != undefined) {
            if ((isValid(parse(end, 'LLLL dd yyyy', new Date())))) {
                let temp_date = parse(end, 'LLLL dd yyyy', new Date());
                let simple_date = temp_date.toISOString().split('T')[0];
                return (simple_date);
            }
            return;
        }
    }
}

module.exports = {
    dateTools,
};