const { EmbedBuilder } = require("discord.js");

const absence = require("../db/absencedb.js");
const absenceCreate = new absence.AttendanceTools();
const absenceSlash = require("../db/absencedb-slash.js");
const absenceDBHelper = new absenceSlash.DataDisplayTools();

class attendanceTools {
    Responses = [];
    counter = 0;
    chosenAction = "";
    bypassList = ["ontime", "present"];
    name = "";

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

    absenceMenuCollection(DM, name) {
        this.chosenAction = "";
        this.name = name;
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
                    this.chosenAction = "absent";
                    absence_collector.stop("one_chosen");
                    break;
                case "2":
                    this.chosenAction = "late";
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
            } else if (reason === "one_chosen" || reason === "two_chosen") {
                this.absenceSingleOrRangeCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    absenceSingleOrRangeCollection(DM) {
        this.counter = 0;
        this.Responses = [];
        const asr_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: "\nOk, so, is this:\n \n\t1. A **Single** Date?\n\t2. A **Range** of Dates?\n\tQ. **Quit**",
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
                this.Responses.push("single");
                this.absenceMonthCollection(DM);
            } else if (reason === "range") {
                this.Responses.push("range");
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
                } else if (this.goodMenuResponses.includes(m.content.toUpperCase())) {
                    tempMonth = m.content;
                    amc_collector.stop("validMonth");
                } else {
                    amc_collector.stop("error");
                }
            }
        });

        amc_collector.on("end", (collected, reason) => {
            if (reason === "validMonth") {
                this.Responses.push(this.months[tempMonth]);
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
            content: `Enter the **day** (ex. 7), or enter 'Q' to **Quit**\n`,
        });

        var tempDay = "";
        var theMessage = "";

        adc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.author.bot === false) {
                if (m.content.toUpperCase() === "Q") {
                    adc_collector.stop("user");
                } else if (this.goodDayResponses.includes(m.content.toUpperCase())) {
                    tempDay = m.content;
                    theMessage = m;
                    this.counter += 1;
                    adc_collector.stop("validDate");
                } else {
                    adc_collector.stop("error");
                }
            }

            adc_collector.on("end", (collected, reason) => {
                if (reason === "validDate") {
                    this.Responses.push(tempDay);
                    if (this.Responses[0] === "single") {
                        if (this.bypassList.includes(this.chosenAction)) {
                            this.absenceProcessSingle(theMessage, DM);
                        } else {
                            this.absenceCommentCollection(DM);
                        }
                    } else if (this.Responses[0] === "range" && this.counter < 2) {
                        this.absenceMonthCollection(DM);
                    } else if (this.Responses[0] === "range" && this.counter == 2) {
                        if (this.bypassList.includes(this.chosenAction)) {
                            if (this.Responses[0] === "single") {
                                this.absenceProcessSingle(theMessage, DM);
                            } else if (this.Responses[0] === "range") {
                                this.absenceProcessRange(theMessage, DM);
                            }
                        } else {
                            this.absenceCommentCollection(DM);
                        }
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

        var comment = "";
        var theMessage = "";

        DM.channel.send({
            content: `Please enter a comment`,
        });

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
                this.Responses.push(comment);
                if (this.Responses[0] === "single") {
                    this.absenceProcessSingle(theMessage, DM);
                } else if (this.Responses[0] === "range") {
                    this.absenceProcessRange(theMessage, DM);
                }
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            }
        });
    }

    absenceProcessSingle(collected, DM) {
        if (this.Responses[0] === "single") {
            let responceList = [this.Responses[1], this.Responses[2], this.Responses[3]];

            if (this.chosenAction === "absent") {
                absenceCreate.absent(collected, responceList);
            } else if (this.chosenAction === "late") {
                absenceCreate.late(collected, responceList);
            } else if (this.chosenAction === "ontime") {
                absenceCreate.ontime(collected, responceList);
            } else if (this.chosenAction === "present") {
                absenceCreate.present(collected, responceList);
            }
            this.askIfSomethingElse(DM);
        }
    }

    absenceProcessRange(collected, DM) {
        if (this.Responses[0] === "range") {
            let responceList = [
                this.Responses[1],
                this.Responses[2],
                this.Responses[3],
                this.Responses[4],
                this.Responses[5],
            ];

            if (this.chosenAction === "absent") {
                absenceCreate.absent(collected, responceList);
            } else if (this.chosenAction === "late") {
                absenceCreate.late(collected, responceList);
            } else if (this.chosenAction === "ontime") {
                absenceCreate.ontime(collected, responceList);
            } else if (this.chosenAction === "present") {
                absenceCreate.present(collected, responceList);
            }
            this.askIfSomethingElse(DM);
        }
    }

    //// Ontime and Present ////
    chooseOntimeOrPresent(DM, name) {
        this.chosenAction = "";
        this.name = name;
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
                    this.chosenAction = "ontime";
                    ontime_collector.stop("one_chosen");
                    break;
                case "2":
                    this.chosenAction = "present";
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
            } else if (reason === "one_chosen" || reason === "two_chosen") {
                this.absenceSingleOrRangeCollection(DM);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    //// Utils ////
    noAbsencesOrLateFound(DM, name) {
        this.name = name;
        DM.channel.send({
            content: "Nothing to cancel! ~ 🐢",
        });
        this.askIfSomethingElse(DM);
    }

    askIfSomethingElse(DM) {
        const otherwise_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: "\n \nWould you like to do something else? (**y**/**n**)\n",
        });

        otherwise_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "y" || "Y":
                    otherwise_collector.stop("yes");
                    break;
                case "n" || "N":
                    otherwise_collector.stop("no");
                    break;
            }
        });

        otherwise_collector.on("end", (collected, reason) => {
            if (reason === "yes") {
                DM.channel.send({
                    content:
                        "Please choose the number that corresponds to what you want to do.\n  \n\t1. **Show/Cancel** Existing Entries\n\t2. Say You'll Be **Absent** or **Late**...\n\tQ. **Quit**",
                });
                this.handleSomethingElse(DM);
            } else if (reason === "no") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            }
        });
    }

    handleSomethingElse(DM) {
        var response = "";
        const otherwise_yes_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        otherwise_yes_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            switch (m.content) {
                case "1":
                    otherwise_yes_collector.stop("one");
                    break;
                case "2":
                    otherwise_yes_collector.stop("two");
                    break;
            }
        });

        otherwise_yes_collector.on("end", (collected, reason) => {
            if (reason === "one") {
                response = absenceDBHelper.show(this.name, "mine");
                DM.channel.send({
                    embeds: [response.absentEmbed, response.lateEmbed],
                });
                if ((response.absentCount || response.lateCount) > 0) {
                    this.chooseOntimeOrPresent(DM);
                } else {
                    this.noAbsencesOrLateFound(DM);
                }
            } else if (reason === "two") {
                this.absenceMenuCollection(DM);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            }
        });
    }
}

module.exports = {
    attendanceTools,
};
