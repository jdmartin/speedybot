const {
    EmbedBuilder
} = require('discord.js');

const absence = require("../db/absencedb.js");
const absenceCreate = new absence.AttendanceTools();

class attendanceTools {

    absenceResponses = [];
    lateResponses = [];
    ontimeResponses = [];
    presentResponses = [];

    counter = 0;

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
                absence_collector.stop('user');
            }
        });

        absence_collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            } else if (reason === 'one_chosen') {
                this.absenceSingleOrRangeCollection(DM);
            } else if (reason === 'two_chosen') {
                this.lateSingleOrRangeCollection(DM);
            } else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    absenceSingleOrRangeCollection(DM) {
        this.counter = 0;
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "\nOk, so, is this:\n \n\t1. A Single Absence?\n\t2. A Range of Absences?\n\tQ. Quit"
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
                collector.stop('user');
            }
        });
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                });
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
                collector.stop('user');
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
                collector.stop('user');
            } else if (goodMenuResponses.includes(m.content)) {
                tempDay = m.content;
                this.counter += 1;
                collector.stop('validDate');
            }

            collector.on('end', (collected, reason) => {
                if (reason === 'validDate') {
                    this.absenceResponses.push(tempDay);
                    if (this.absenceResponses[0] === 'single') {
                        this.absenceCommentCollection(DM);     
                    } else if (this.absenceResponses[0] === 'range' && this.counter < 2) {
                        this.absenceMonthCollection(DM);
                    } else if (this.absenceResponses[0] === 'range' && this.counter == 2) {
                        this.absenceCommentCollection(DM);
                    }
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
        var theMessage = '';
        
        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            if (m.content && m.author.bot === false) {
                comment = m.content;
                theMessage = m;
                collector.stop('validComment');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'validComment') {
                this.absenceResponses.push(comment);
                if (this.absenceResponses[0] === 'single') {
                    this.absenceProcessSingle(theMessage);
                } else if (this.absenceResponses[0] === 'range') {
                    this.absenceProcessRange(theMessage);
                }
            } else if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            }
        });
    }

    absenceProcessSingle(collected) {
        if (this.absenceResponses[0] === 'single') {
            absenceCreate.absent(collected, [this.absenceResponses[1], this.absenceResponses[2], this.absenceResponses[3]])
        }
    }

    absenceProcessRange(collected) {
        if (this.absenceResponses[0] === 'range') {
            absenceCreate.absent(collected, [this.absenceResponses[1], this.absenceResponses[2], this.absenceResponses[3], this.absenceResponses[4], this.absenceResponses[5]])
        }
    }

    //// LATE ////
    lateSingleOrRangeCollection(DM) {
        this.counter = 0;
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "\nOk, so, is this:\n \n\t1. Late Just Once?\n\t2. Late A Bunch Of Times?\n\tQ. Quit"
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
                collector.stop('user');
            }
        });
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                });
            } else if (reason === 'single') {
                this.lateResponses.push('single');
                this.lateMonthCollection(DM);
            } else if (reason === 'range') {
                this.lateResponses.push('range');
                this.lateMonthCollection(DM);
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
                collector.stop('user');
            } else if (goodMenuResponses.includes(m.content)) {
                tempMonth = m.content;
                collector.stop('validMonth');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'validMonth') {
                this.lateResponses.push(this.months[tempMonth]);  
                this.lateDayCollection(DM);
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
    }

    lateDayCollection(DM) {
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
                collector.stop('user');
            } else if (goodMenuResponses.includes(m.content)) {
                tempDay = m.content;
                this.counter += 1;
                collector.stop('validDate');
            }

            collector.on('end', (collected, reason) => {
                if (reason === 'validDate') {
                    this.lateResponses.push(tempDay);
                    if (this.lateResponses[0] === 'single') {
                        this.lateCommentCollection(DM);     
                    } else if (this.lateResponses[0] === 'range' && this.counter < 2) {
                        this.lateMonthCollection(DM);
                    } else if (this.lateResponses[0] === 'range' && this.counter == 2) {
                        this.lateCommentCollection(DM);
                    }     
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

    lateCommentCollection(DM) {
        const collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Please enter a comment`
        });

        var comment = '';
        var theMessage = '';
        
        collector.on('collect', m => { //Triggered when the collector is receiving a new message
            if (m.content && m.author.bot === false) {
                comment = m.content;
                theMessage = m;
                collector.stop('validComment');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'validComment') {
                this.lateResponses.push(comment);  
                if (this.lateResponses[0] === 'single') {
                    this.lateProcessSingle(theMessage);
                } else if (this.lateResponses[0] === 'range') {
                    this.lateProcessRange(theMessage);
                }
            } else if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            }
        });
    }

    lateProcessSingle(collected) {
        if (this.lateResponses[0] === 'single') {
            absenceCreate.late(collected, [this.lateResponses[1], this.lateResponses[2], this.lateResponses[3]])
        }
    }

    lateProcessRange(collected) {
        if (this.lateResponses[0] === 'range') {
            absenceCreate.late(collected, [this.lateResponses[1], this.lateResponses[2], this.lateResponses[3], this.lateResponses[4], this.lateResponses[5]])
        }
    }

    //// Ontime and Present ////
    chooseOntimeOrPresent(DM) {
        const ontime_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "\n \nWhat would you like to do?\n \n\t1. Say I'll Be On-Time \n\t2. Say I'll Be Present\n\tQ. Quit"
        });

        ontime_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', 'Q'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                ontime_collector.stop('one_chosen');
            } else if (m.content == '2') {
                ontime_collector.stop('two_chosen');
            } else if (m.content.toUpperCase() == 'Q') {
                ontime_collector.stop('user');
            }
        });

        ontime_collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                });
            }
            else if (reason === 'one_chosen') {
                this.ontimeSingleOrRangeCollection(DM);
            } else if (reason === 'two_chosen') {
                this.presentSingleOrRangeCollection(DM);
            }
            else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    ontimeSingleOrRangeCollection(DM) {
        this.counter = 0;
        const osr_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "\nOk, so, is this:\n \n\t1. On-time Just Once?\n\t2. On-time A Bunch Of Times?\n\tQ. Quit"
        });

        osr_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', 'Q'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                osr_collector.stop('single');
            } else if (m.content == '2') {
                osr_collector.stop('range');
            } else if (m.content.toUpperCase() == 'Q') {
                osr_collector.stop('user');
            }
        });
        
        osr_collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                });
            } else if (reason === 'single') {
                this.ontimeResponses.push('single');
                this.ontimeMonthCollection(DM);
            } else if (reason === 'range') {
                this.ontimeResponses.push('range');
                this.ontimeMonthCollection(DM);
            } else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    ontimeMonthCollection(DM) {
        const omc_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Please choose a month by number, or enter 'Q' to Quit\n${this.monthMenu}`
        });

        var tempMonth = '';
        
        omc_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                omc_collector.stop('user');
            } else if (goodMenuResponses.includes(m.content)) {
                tempMonth = m.content;
                omc_collector.stop('validMonth');
            }
        });

        omc_collector.on('end', (collected, reason) => {
            if (reason === 'validMonth') {
                this.ontimeResponses.push(this.months[tempMonth]);  
                this.ontimeDayCollection(DM);
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
    }

    ontimeDayCollection(DM) {
        const odc_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Enter the day you will be on-time (ex. 7), or enter 'Q' to Quit\n`
        });
        
        var tempDay = '';
        var theMessage = '';
        
        odc_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['01', '1', '02', '2', '03', '3', '04', '4', '05', '5', '06', '6', '07', '7', '08', '8', '09', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                odc_collector.stop('user');
            } else if (goodMenuResponses.includes(m.content)) {
                tempDay = m.content;
                this.counter += 1;
                theMessage = m;
                odc_collector.stop('validDate');
            }

            odc_collector.on('end', (collected, reason) => {
                if (reason === 'validDate') {
                    this.ontimeResponses.push(tempDay);
                    if (this.ontimeResponses[0] === 'single') {
                        this.ontimeProcessSingle(theMessage);     
                    } else if (this.ontimeResponses[0] === 'range' && this.counter < 2) {
                        this.ontimeMonthCollection(theMessage);
                    } else if (this.ontimeResponses[0] === 'range' && this.counter == 2) {
                        this.ontimeProcessRange(theMessage);
                    }     
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

    ontimeProcessSingle(collected) {
        if (this.ontimeResponses[0] === 'single') {
            absenceCreate.ontime(collected, [this.ontimeResponses[1], this.ontimeResponses[2]])
        }
    }

    ontimeProcessRange(collected) {
        if (this.ontimeResponses[0] === 'range') {
            absenceCreate.ontime(collected, [this.ontimeResponses[1], this.ontimeResponses[2], this.ontimeResponses[3], this.ontimeResponses[4]])
        }
    }

    presentSingleOrRangeCollection(DM) {
        this.counter = 0;
        const psr_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: "\nOk, so, is this:\n \n\t1. Cancel One Absence?\n\t2. Cancel a Range of Absences?\n\tQ. Quit"
        });

        psr_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', 'Q'];

            if (!goodMenuResponses.includes(m.content.toUpperCase()) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content == '1') {
                psr_collector.stop('single');
            } else if (m.content == '2') {
                psr_collector.stop('range');
            } else if (m.content.toUpperCase() == 'Q') {
                psr_collector.stop('user');
            }
        });
        
        psr_collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`
                })
            } else if (reason === 'single') {
                this.presentResponses.push('single');
                this.presentMonthCollection(DM);
            } else if (reason === 'range') {
                this.presentResponses.push('range');
                this.presentMonthCollection(DM);
            } else if (reason === 'user') {
                DM.channel.send({
                    content: "Ok, see you!"
                });
            }
        });
    }

    presentMonthCollection(DM) {
        const pmc_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Please choose a month by number, or enter 'Q' to Quit\n${this.monthMenu}`
        });

        var tempMonth = '';
        
        pmc_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                pmc_collector.stop();
            } else if (goodMenuResponses.includes(m.content)) {
                tempMonth = m.content;
                pmc_collector.stop('validMonth');
            }
        });

        pmc_collector.on('end', (collected, reason) => {
            if (reason === 'validMonth') {
                this.presentResponses.push(this.months[tempMonth]);  
                this.presentDayCollection(DM);
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

    presentDayCollection(DM) {
        const pdc_collector = DM.channel.createMessageCollector({
            time: 30000
        });

        DM.channel.send({
            content: `Enter the day you will be on-time (ex. 7), or enter 'Q' to Quit\n`
        });
        
        var tempDay = '';
        var theMessage = '';
        
        pdc_collector.on('collect', m => { //Triggered when the collector is receiving a new message
            let goodMenuResponses = ['01', '1', '02', '2', '03', '3', '04', '4', '05', '5', '06', '6', '07', '7', '08', '8', '09', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 'Q'];

            if (!goodMenuResponses.includes(m.content) && m.author.bot === false) {
                DM.channel.send({
                    content: `Sorry, I don't know what to do with '${m.content}'. Please try again.`
                });
            } else if (m.content.toUpperCase() === 'Q') {
                pdc_collector.stop('user');
            } else if (goodMenuResponses.includes(m.content)) {
                tempDay = m.content;
                this.counter += 1;
                theMessage = m;
                pdc_collector.stop('validDate');
            }

            pdc_collector.on('end', (collected, reason) => {
                if (reason === 'validDate') {
                    this.presentResponses.push(tempDay);
                    if (this.presentResponses[0] === 'single') {
                        this.presentProcessSingle(theMessage);     
                    } else if (this.presentResponses[0] === 'range' && this.counter < 2) {
                        this.presentMonthCollection(theMessage);
                    } else if (this.presentResponses[0] === 'range' && this.counter == 2) {
                        this.presentProcessRange(theMessage);
                    }     
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

    presentProcessSingle(collected) {
        if (this.presentResponses[0] === 'single') {
            absenceCreate.present(collected, [this.presentResponses[1], this.presentResponses[2]])
        }
    }

    presentProcessRange(collected) {
        if (this.presentResponses[0] === 'range') {
            absenceCreate.present(collected, [this.presentResponses[1], this.presentResponses[2], this.presentResponses[3], this.presentResponses[4]])
        }
    }
}

module.exports = {
    attendanceTools,
};