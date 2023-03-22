const {
    EmbedBuilder
} = require('discord.js');

class attendanceTools {

    absenceResponses = []
    lateResponses = []

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
            content: "\n \nWhat would you like to do?\n \n\t1. Add an Absence \n\t2. Say I'll Be Late\n\tQ. Quit"
        });

        absence_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', 'Q'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                absence_collector.stop('one_chosen');
            } else if (m.content == '2') {
                absence_collector.stop('two_chosen');
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
            } else if (reason === 'two_chosen') {
                this.lateSingleOrRangeCollection(DM);
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
            content: "Ok, so, is this:\n \n\t1. A Single Absence?\n\t2. A Range of Absences?\n\tQ. Quit"
        });

        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', 'Q'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                collector.stop('single');
            } else if (m.content == '2') {
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
                this.absenceResponses.push('single');
                this.absenceMonthCollection(DM);
            } else if (reason === 'range') {
                this.absenceResponses.push('range');
                this.absenceMonthCollection(DM);
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
            content: `Please choose a month by number, or enter 'Q' to Quit\n${this.monthMenu}`
        });

        var tempMonth = '';
        
        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                collector.stop();
            } else if (goodMenuResponses.includes(m.content)) {
                tempMonth = m.content;
                collector.stop('validMonth');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'validMonth') {
                this.absenceResponses.push(this.months[tempMonth]);  
                this.absenceDayCollection(DM);
            } else if (reason === 'time') {
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
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Enter the day you will be absent (ex. 7), or enter 'Q' to Quit\n`
        });
        
        var tempDay = '';
        
        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['01', '1', '02', '2', '03', '3', '04', '4', '05', '5', '06', '6', '07', '7', '08', '8', '09', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                collector.stop();
            } else if (goodMenuResponses.includes(m.content)) {
                tempDay = m.content;
                collector.stop('validDate');
            }

            collector.on('end', (collected, reason) => {
                if (reason === 'validDate') {
                    this.absenceResponses.push(tempDay);
                    this.absenceCommentCollection(DM);     
                } else if (reason === 'time') {
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                    });
                } else if (reason === 'user') {
                    DM.channel.send({
                        content: "Ok, see you!"
                    });
                }
            });
        });
    }

    absenceCommentCollection(DM) {
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Please enter a comment`
        });

        var comment = '';
        
        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            if (m.content && m.author.bot === false) {
                comment = m.content;
                collector.stop('validComment');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'validComment') {
                this.absenceResponses.push(comment);  
                this.absenceRespond(DM);
            } else if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            }
        });
    }

    absenceRespond(DM) {
        DM.channel.send({
            content: this.absenceResponses.toString()
        });
    }

    //// LATE ////
    lateSingleOrRangeCollection(DM) {
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "Ok, so, is this:\n \n\t1. A One-Off?\n\t2. A Range of Dates?\n\t4. Quit"
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
                this.lateMonthCollection(DM);
            } else if (reason === 'range') {
                this.lateResponses.push('bar')
                DM.channel.send({
                    content: this.lateResponses[0] + " " + this.lateResponses[1]
                });
            } else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    lateMonthCollection(DM) {
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
                this.lateResponses.push(this.months[m.content])     
                DM.channel.send({
                    content: this.lateResponses[0]
                });
            }
        });
    }
}

module.exports = {
    attendanceTools,
};