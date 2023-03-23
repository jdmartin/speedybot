const { EmbedBuilder } = require("discord.js");

const absence = require("../db/absencedb.js");
const absenceCreate = new absence.AttendanceTools();

class attendanceTools {
    absenceResponses = [];
    lateResponses = [];
    ontimeResponses = [];
    presentResponses = [];

    counter = 0;

    // prettier-ignore
    goodDayResponses = [
        "01", "1", "02", "2", "03", "3", "04", "4", "05", "5", "06", "6", "07", "7", "08", "8", "09", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "Q",
    ];
    // prettier-ignore
    goodMenuResponses = [
        "01", "1", "02", "2", "03", "3", "04", "4", "05", "5", "06", "6", "07", "7", "08", "8", "09", "9", "10", "11", "12", "Q",
    ];

    months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };

    monthMenu =
        "\n\t**1**.\t January\n\t**2**.\t February\n\t**3**.\t March\n\t**4**.\t April\n\t**5**.\t May\n\t**6**.\t June\n\t**7**.\t July\n\t**8**.\t August\n\t**9**.\t September\n\t**10**.\tOctober\n\t**11**.\tNovember\n\t**12**.\tDecember\n";

    absenceMenuCollection(DM) {
        const absence_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\n \nWhat would you like to do?\n \n\t1. Add an **Absence** \n\t2. Say I'll Be **Late**\n\tQ. **Quit**",
        });

        absence_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    absence_collector.stop("one_chosen");
                    break;
                case "2":
                    absence_collector.stop("two_chosen");
                    break;
                case "q" || "Q":
                    absence_collector.stop("user");
                    break;
            }
        });

        absence_collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "one_chosen") {
                this.absenceSingleOrRangeCollection(DM);
            } else if (reason === "two_chosen") {
                this.lateSingleOrRangeCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    absenceSingleOrRangeCollection(DM) {
        this.counter = 0;
        this.absenceResponses = [];
        const asr_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\nOk, so, is this:\n \n\t1. A **Single** Absence?\n\t2. A **Range** of Absences?\n\tQ. **Quit**",
        });

        asr_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    asr_collector.stop("single");
                    break;
                case "2":
                    asr_collector.stop("range");
                    break;
                case "q" || "Q":
                    asr_collector.stop("user");
                    break;
            }
        });
        asr_collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "single") {
                this.absenceResponses.push("single");
                this.absenceMonthCollection(DM);
            } else if (reason === "range") {
                this.absenceResponses.push("range");
                this.absenceMonthCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    absenceMonthCollection(DM) {
        const amc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Please choose a month by **number**, or enter 'Q' to **Quit**\n${this.monthMenu}`,
        });

        var tempMonth = "";

        amc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    amc_collector.stop("user");
                } else if (
                    this.goodMenuResponses.includes(m.content.toUpperCase())
                ) {
                    tempMonth = m.content;
                    amc_collector.stop("validMonth");
                } else {
                    amc_collector.stop("error");
                }
            }
        });

        amc_collector.on("end", (collected, reason) => {
            if (reason === "validMonth") {
                this.absenceResponses.push(this.months[tempMonth]);
                this.absenceDayCollection(DM);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            } else if (reason === "error") {
                this.absenceMonthCollection(DM);
            }
        });
    }

    absenceDayCollection(DM) {
        const adc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Enter the **day** you will be absent (ex. 7), or enter 'Q' to **Quit**\n`,
        });

        var tempDay = "";

        adc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    adc_collector.stop("user");
                } else if (
                    this.goodDayResponses.includes(m.content.toUpperCase())
                ) {
                    tempDay = m.content;
                    this.counter += 1;
                    adc_collector.stop("validDate");
                } else {
                    adc_collector.stop("error");
                }
            }

            adc_collector.on("end", (collected, reason) => {
                if (reason === "validDate") {
                    this.absenceResponses.push(tempDay);
                    if (this.absenceResponses[0] === "single") {
                        this.absenceCommentCollection(DM);
                    } else if (
                        this.absenceResponses[0] === "range" &&
                        this.counter < 2
                    ) {
                        this.absenceMonthCollection(DM);
                    } else if (
                        this.absenceResponses[0] === "range" &&
                        this.counter == 2
                    ) {
                        this.absenceCommentCollection(DM);
                    }
                } else if (reason === "time") {
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                } else if (reason === "user") {
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                } else if (reason === "error") {
                    this.absenceDayCollection(DM);
                }
            });
        });
    }

    absenceCommentCollection(DM) {
        const acc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Please enter a comment`,
        });

        var comment = "";
        var theMessage = "";

        acc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.content && m.author.bot === false) {
                comment = m.content;
                theMessage = m;
                acc_collector.stop("validComment");
            }
        });

        acc_collector.on("end", (collected, reason) => {
            if (reason === "validComment") {
                this.absenceResponses.push(comment);
                if (this.absenceResponses[0] === "single") {
                    this.absenceProcessSingle(theMessage);
                } else if (this.absenceResponses[0] === "range") {
                    this.absenceProcessRange(theMessage);
                }
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            }
        });
    }

    absenceProcessSingle(collected) {
        if (this.absenceResponses[0] === "single") {
            absenceCreate.absent(collected, [
                this.absenceResponses[1],
                this.absenceResponses[2],
                this.absenceResponses[3],
            ]);
        }
    }

    absenceProcessRange(collected) {
        if (this.absenceResponses[0] === "range") {
            absenceCreate.absent(collected, [
                this.absenceResponses[1],
                this.absenceResponses[2],
                this.absenceResponses[3],
                this.absenceResponses[4],
                this.absenceResponses[5],
            ]);
        }
    }

    //// LATE ////
    lateSingleOrRangeCollection(DM) {
        this.counter = 0;
        this.lateResponses = [];
        const lsr_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\nOk, so, is this:\n \n\t1. Late Just **Once**?\n\t2. Late A **Bunch Of Times**?\n\tQ. **Quit**",
        });

        lsr_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    lsr_collector.stop("single");
                    break;
                case "2":
                    lsr_collector.stop("range");
                    break;
                case "q" || "Q":
                    lsr_collector.stop("user");
                    break;
            }
        });
        lsr_collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "single") {
                this.lateResponses.push("single");
                this.lateMonthCollection(DM);
            } else if (reason === "range") {
                this.lateResponses.push("range");
                this.lateMonthCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    lateMonthCollection(DM) {
        const lmc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Please choose a month by **number**, or enter 'Q' to **Quit**\n${this.monthMenu}`,
        });

        var tempMonth = "";

        lmc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    lmc_collector.stop("user");
                } else if (
                    this.goodMenuResponses.includes(m.content.toUpperCase())
                ) {
                    tempMonth = m.content;
                    lmc_collector.stop("validMonth");
                } else {
                    lmc_collector.stop("error");
                }
            }
        });

        lmc_collector.on("end", (collected, reason) => {
            if (reason === "validMonth") {
                this.lateResponses.push(this.months[tempMonth]);
                this.lateDayCollection(DM);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            } else if (reason === "error") {
                this.lateMonthCollection(DM);
            }
        });
    }

    lateDayCollection(DM) {
        const ldc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "Enter the **day** you will be late (ex. 7), or enter 'Q' to **Quit**\n",
        });

        var tempDay = "";

        ldc_collector.on("collect", (m) => {
            if (m.author.bot === false) {
                //Triggered when the collector is receiving a new message
                if (m.content.toUpperCase() == "Q") {
                    ldc_collector.stop("user");
                } else if (
                    this.goodDayResponses.includes(m.content.toUpperCase())
                ) {
                    tempDay = m.content;
                    this.counter += 1;
                    ldc_collector.stop("validDate");
                } else {
                    ldc_collector.stop("error");
                }
            }

            ldc_collector.on("end", (collected, reason) => {
                if (reason === "validDate") {
                    this.lateResponses.push(tempDay);
                    if (this.lateResponses[0] === "single") {
                        this.lateCommentCollection(DM);
                    } else if (
                        this.lateResponses[0] === "range" &&
                        this.counter < 2
                    ) {
                        this.lateMonthCollection(DM);
                    } else if (
                        this.lateResponses[0] === "range" &&
                        this.counter == 2
                    ) {
                        this.lateCommentCollection(DM);
                    }
                } else if (reason === "time") {
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                } else if (reason === "user") {
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                } else if (reason === "error") {
                    this.lateDayCollection(DM);
                }
            });
        });
    }

    lateCommentCollection(DM) {
        const lcc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Please enter a comment`,
        });

        var comment = "";
        var theMessage = "";

        lcc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.content && m.author.bot === false) {
                comment = m.content;
                theMessage = m;
                lcc_collector.stop("validComment");
            }
        });

        lcc_collector.on("end", (collected, reason) => {
            if (reason === "validComment") {
                this.lateResponses.push(comment);
                if (this.lateResponses[0] === "single") {
                    this.lateProcessSingle(theMessage);
                } else if (this.lateResponses[0] === "range") {
                    this.lateProcessRange(theMessage);
                }
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            }
        });
    }

    lateProcessSingle(collected) {
        if (this.lateResponses[0] === "single") {
            absenceCreate.late(collected, [
                this.lateResponses[1],
                this.lateResponses[2],
                this.lateResponses[3],
            ]);
        }
    }

    lateProcessRange(collected) {
        if (this.lateResponses[0] === "range") {
            absenceCreate.late(collected, [
                this.lateResponses[1],
                this.lateResponses[2],
                this.lateResponses[3],
                this.lateResponses[4],
                this.lateResponses[5],
            ]);
        }
    }

    //// Ontime and Present ////
    chooseOntimeOrPresent(DM) {
        const ontime_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\n \nWhat would you like to do?\n \n\t1. Say I'll Be **On-Time** \n\t2. Say I'll Be **Present**\n\tQ. **Quit**",
        });

        ontime_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    ontime_collector.stop("one_chosen");
                    break;
                case "2":
                    ontime_collector.stop("two_chosen");
                    break;
                case "q" || "Q":
                    ontime_collector.stop("user");
                    break;
            }
        });

        ontime_collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "one_chosen") {
                this.ontimeSingleOrRangeCollection(DM);
            } else if (reason === "two_chosen") {
                this.presentSingleOrRangeCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    ontimeSingleOrRangeCollection(DM) {
        this.counter = 0;
        this.ontimeResponses = [];
        const osr_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\nOk, so, is this:\n \n\t1. On-time Just **Once**?\n\t2. On-time A **Bunch Of Times**?\n\tQ. **Quit**",
        });

        osr_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    osr_collector.stop("single");
                    break;
                case "2":
                    osr_collector.stop("range");
                    break;
                case "q" || "Q":
                    osr_collector.stop("user");
                    break;
            }
        });

        osr_collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "single") {
                this.ontimeResponses.push("single");
                this.ontimeMonthCollection(DM);
            } else if (reason === "range") {
                this.ontimeResponses.push("range");
                this.ontimeMonthCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    ontimeMonthCollection(DM) {
        const omc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Please choose a month by **number**, or enter 'Q' to **Quit**\n${this.monthMenu}`,
        });

        var tempMonth = "";

        omc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    omc_collector.stop("user");
                } else if (
                    this.goodMenuResponses.includes(m.content.toUpperCase())
                ) {
                    tempMonth = m.content;
                    omc_collector.stop("validMonth");
                } else {
                    omc_collector.stop("error");
                }
            }
        });

        omc_collector.on("end", (collected, reason) => {
            if (reason === "validMonth") {
                this.ontimeResponses.push(this.months[tempMonth]);
                this.ontimeDayCollection(DM);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            } else if (reason === "error") {
                this.ontimeMonthCollection(DM);
            }
        });
    }

    ontimeDayCollection(DM) {
        const odc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Enter the **day** you will be on-time (ex. 7), or enter 'Q' to **Quit**\n`,
        });

        var tempDay = "";
        var theMessage = "";

        odc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    odc_collector.stop("user");
                } else if (
                    this.goodDayResponses.includes(m.content.toUpperCase())
                ) {
                    tempDay = m.content;
                    this.counter += 1;
                    theMessage = m;
                    odc_collector.stop("validDate");
                } else {
                    odc_collector.stop("error");
                }
            }

            odc_collector.on("end", (collected, reason) => {
                if (reason === "validDate") {
                    this.ontimeResponses.push(tempDay);
                    if (this.ontimeResponses[0] === "single") {
                        this.ontimeProcessSingle(theMessage);
                    } else if (
                        this.ontimeResponses[0] === "range" &&
                        this.counter < 2
                    ) {
                        this.ontimeMonthCollection(theMessage);
                    } else if (
                        this.ontimeResponses[0] === "range" &&
                        this.counter == 2
                    ) {
                        this.ontimeProcessRange(theMessage);
                    }
                } else if (reason === "time") {
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                } else if (reason === "user") {
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                } else if (reason === "error") {
                    this.ontimeDayCollection(DM);
                }
            });
        });
    }

    ontimeProcessSingle(collected) {
        if (this.ontimeResponses[0] === "single") {
            absenceCreate.ontime(collected, [
                this.ontimeResponses[1],
                this.ontimeResponses[2],
            ]);
        }
    }

    ontimeProcessRange(collected) {
        if (this.ontimeResponses[0] === "range") {
            absenceCreate.ontime(collected, [
                this.ontimeResponses[1],
                this.ontimeResponses[2],
                this.ontimeResponses[3],
                this.ontimeResponses[4],
            ]);
        }
    }

    presentSingleOrRangeCollection(DM) {
        this.counter = 0;
        this.presentResponses = [];
        const psr_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\nOk, so, is this:\n \n\t1. Cancel **One Absence**?\n\t2. Cancel a **Range of Absences**?\n\tQ. **Quit**",
        });

        psr_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    psr_collector.stop("single");
                    break;
                case "2":
                    psr_collector.stop("range");
                    break;
                case "q" || "Q":
                    psr_collector.stop("user");
                    break;
            }
        });

        psr_collector.on("end", (collected, reason) => {
            if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "single") {
                this.presentResponses.push("single");
                this.presentMonthCollection(DM);
            } else if (reason === "range") {
                this.presentResponses.push("range");
                this.presentMonthCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    presentMonthCollection(DM) {
        const pmc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Please choose a month by **number**, or enter 'Q' to **Quit**\n${this.monthMenu}`,
        });

        var tempMonth = "";

        pmc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    pmc_collector.stop("user");
                } else if (
                    this.goodMenuResponses.includes(m.content.toUpperCase())
                ) {
                    tempMonth = m.content;
                    pmc_collector.stop("validMonth");
                } else {
                    pmc_collector.stop("error");
                }
            }
        });

        pmc_collector.on("end", (collected, reason) => {
            if (reason === "validMonth") {
                this.presentResponses.push(this.months[tempMonth]);
                this.presentDayCollection(DM);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            } else if (reason === "error") {
                this.presentMonthCollection(DM);
            }
        });
    }

    presentDayCollection(DM) {
        const pdc_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: `Enter the **day** you will be on-time (ex. 7), or enter 'Q' to **Quit**\n`,
        });

        var tempDay = "";
        var theMessage = "";

        pdc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    pdc_collector.stop("user");
                } else if (
                    this.goodDayResponses.includes(m.content.toUpperCase())
                ) {
                    tempDay = m.content;
                    this.counter += 1;
                    theMessage = m;
                    pdc_collector.stop("validDate");
                } else {
                    pdc_collector.stop("error");
                }
            }

            pdc_collector.on("end", (collected, reason) => {
                if (reason === "validDate") {
                    this.presentResponses.push(tempDay);
                    if (this.presentResponses[0] === "single") {
                        this.presentProcessSingle(theMessage);
                    } else if (
                        this.presentResponses[0] === "range" &&
                        this.counter < 2
                    ) {
                        this.presentMonthCollection(theMessage);
                    } else if (
                        this.presentResponses[0] === "range" &&
                        this.counter == 2
                    ) {
                        this.presentProcessRange(theMessage);
                    }
                } else if (reason === "time") {
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                } else if (reason === "user") {
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                } else if (reason === "error") {
                    this.presentDayCollection(DM);
                }
            });
        });
    }

    presentProcessSingle(collected) {
        if (this.presentResponses[0] === "single") {
            absenceCreate.present(collected, [
                this.presentResponses[1],
                this.presentResponses[2],
            ]);
        }
    }

    presentProcessRange(collected) {
        if (this.presentResponses[0] === "range") {
            absenceCreate.present(collected, [
                this.presentResponses[1],
                this.presentResponses[2],
                this.presentResponses[3],
                this.presentResponses[4],
            ]);
        }
    }

    //// Utils ////
    noAbsencesOrLateFound(DM) {
        DM.channel.send({
            content: "Nothing to cancel!  See you later! ~ 🐢",
        });
    }
}

module.exports = {
    attendanceTools,
};
