const {
    EmbedBuilder
} = require('discord.js');

class attendanceTools {

    absenceReponses = []

    months = {
        "1": 'January',
        "2": 'February',
        "3": 'March',
        "4": 'April',
        "5": 'May',
        "6": 'June',
        "7": 'July',
        "8": 'August',
        "9": 'September',
        "10": 'October',
        "11": 'November',
        "12": 'December'
    }

    monthMenu = "\n\t1. January\n\t2. February\n\t3. March\n\t4. April\n\t5. May\n\t6. June\n\t7. July\n\t8. August\n\t9. September\n\t10. October\n\t11. November\n\t12. December\n"

    absenceMenuCollection(DM) {
        const absence_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "\n \nWhat would you like to do?\n \n\t1. Add an Absence or Say I'll Be Late\n\tQ. Quit"
        });

        absence_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '4'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                absence_collector.stop('one_chosen');
            } else if (m.content.toUpperCase() == 'Q') {
                absence_collector.stop();
            }
        });

        absence_collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            }
            else if (reason === 'one_chosen') {
                this.absenceSingleOrRangeCollection(DM);
            }
            else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    absenceSingleOrRangeCollection(DM) {
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "Ok, so, is this:\n \n\t1. A Single Absence?\n\t2. A Range of Absences?\n\t4. Quit"
        });

        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', '3', '4', 'Q'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1' || m.content == '3') {
                collector.stop('single');
            } else if (m.content == '2' || m.content == '4') {
                collector.stop('range');
            } else if (m.content.toUpperCase() == 'Q') {
                collector.stop();
            }
        });
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            } else if (reason === 'single') {
                this.absenceMonthCollection(DM);
            } else if (reason === 'range') {
                this.absenceReponses.push('bar')
                DM.channel.send({
                    content: this.absenceReponses[0] + " " + this.absenceResponses[1]
                });
            } else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    absenceMonthCollection(DM) {
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Please choose a month, or enter 'Q' to Quit\n${this.monthMenu}`
        });
        //TODO: Add some end conditions here!
        
        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                collector.stop();
            } else if (goodMenuResponses.includes(m.content)) {
                this.absenceReponses.push(this.months[m.content])     
                DM.channel.send({
                    content: this.absenceReponses[0]
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            } else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    absenceDayCollection(DM) {

    }

    absenceRespond(DM) {

    }

}

module.exports = {
    attendanceTools,
};