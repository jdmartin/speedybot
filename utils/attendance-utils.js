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
    restriction = "";

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
        this.restriction = "";
        const absence_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\n \nWhat would you like to do?\n \n\t1. Add an **Absence** \n\t2. Say I'll Be **Late**\n\tM. **Main Menu**\n\tQ. **Quit**",
        });

        absence_collector.on("collect", (m) => {
            let validAnswers = ["1", "2", "m", "M", "q", "Q"];
            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM, m.content);
                }
            }
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
                case "m" || "M":
                    absence_collector.stop("menu");
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
                this.absenceSingleOrRangeCollection(DM, name);
            } else if (reason === "menu") {
                this.backToMainMenu(DM, name);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    absenceSingleOrRangeCollection(DM, name) {
        this.counter = 0;
        this.Responses = [];
        const asr_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\nOk, so, is this:\n \n\t1. A **Single** Date?\n\t2. A **Range** of Dates?\n\n\t3. Recurring (**Tuesdays**)?\n\t4. Recurring (**Thursdays**)?\n\t5. Recurring (**Sundays**)?\n\t\n\n\tM. **Main Menu**\n\tQ. **Quit**",
        });

        asr_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["1", "2", "3", "4", "5", "m", "M", "q", "Q"];
            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM, m.content);
                }
            }
            switch (m.content) {
                case "1":
                    asr_collector.stop("single");
                    break;
                case "2":
                    asr_collector.stop("range");
                    break;
                case "3":
                    this.restriction = "Tuesdays";
                    asr_collector.stop("range");
                    break;
                case "4":
                    this.restriction = "Thursdays";
                    asr_collector.stop("range");
                    break;
                case "5":
                    this.restriction = "Sundays";
                    asr_collector.stop("range");
                    break;
                case "m" || "M":
                    asr_collector.stop("menu");
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
                this.absenceMonthCollection(DM, name);
            } else if (reason === "range") {
                this.Responses.push("range");
                this.absenceMonthCollection(DM, name);
            } else if (reason === "menu") {
                this.backToMainMenu(DM, name);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    absenceMonthCollection(DM, name) {
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
                if (!this.goodMenuResponses.includes(m.content.toUpperCase())) {
                    this.sorryTryAgain(DM, m.content);
                    amc_collector.stop("error");
                }
                if (m.content.toUpperCase() === "Q") {
                    amc_collector.stop("user");
                }
                if (this.goodMenuResponses.includes(m.content.toUpperCase())) {
                    tempMonth = m.content;
                    amc_collector.stop("validMonth");
                }
            }
        });

        amc_collector.on("end", (collected, reason) => {
            if (reason === "error") {
                this.absenceMonthCollection(DM, name);
            } else if (reason === "validMonth") {
                this.Responses.push(this.months[tempMonth]);
                this.absenceDayCollection(DM, name);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    absenceDayCollection(DM, name) {
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
                if (m.content.toUpperCase === "Q") {
                    adc_collector.stop("user");
                } else if (!this.goodDayResponses.includes(m.content.toUpperCase())) {
                    adc_collector.stop("error");
                } else if (this.goodDayResponses.includes(m.content)) {
                    tempDay = m.content;
                    theMessage = m;
                    this.counter += 1;
                    adc_collector.stop("validDate");
                }
            }
        });

        adc_collector.on("end", (collected, reason) => {
            if (reason === "validDate") {
                this.Responses.push(tempDay);
                if (this.Responses[0] === "single") {
                    if (this.bypassList.includes(this.chosenAction)) {
                        this.absenceProcessSingle(theMessage, DM, name);
                    } else {
                        this.absenceCommentCollection(DM, name);
                    }
                } else if (this.Responses[0] === "range" && this.counter == 1) {
                    this.absenceMonthCollection(DM, name);
                } else if (this.Responses[0] === "range" && this.counter == 2) {
                    if (this.bypassList.includes(this.chosenAction)) {
                        this.absenceProcessRange(theMessage, DM, name);
                    } else {
                        this.absenceCommentCollection(DM, name);
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
                this.sorryTryAgain(DM);
                this.absenceDayCollection(DM, name);
            }
        });
    }

    absenceCommentCollection(DM, name) {
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
                    this.absenceProcessSingle(theMessage, DM, name);
                } else if (this.Responses[0] === "range") {
                    this.absenceProcessRange(theMessage, DM, name);
                }
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            }
        });
    }

    absenceProcessSingle(collected, DM, name) {
        if (this.Responses[0] === "single") {
            let responceList = [this.Responses[1], this.Responses[2], this.Responses[3]];

            const doTheThing = async () => {
                if (this.chosenAction === "absent") {
                    absenceCreate.absent(collected, this.restriction, responceList);
                } else if (this.chosenAction === "late") {
                    absenceCreate.late(collected, this.restriction, responceList);
                } else if (this.chosenAction === "ontime") {
                    absenceCreate.ontime(collected, this.restriction, responceList);
                } else if (this.chosenAction === "present") {
                    absenceCreate.present(collected, this.restriction, responceList);
                }
            };
            doTheThing().then(() => {
                this.askIfSomethingElse(DM, name);
            });
        }
    }

    absenceProcessRange(collected, DM, name) {
        if (this.Responses[0] === "range") {
            let responceList = [
                this.Responses[1],
                this.Responses[2],
                this.Responses[3],
                this.Responses[4],
                this.Responses[5],
            ];

            const doTheThing = async () => {
                if (this.chosenAction === "absent") {
                    absenceCreate.absent(collected, this.restriction, responceList);
                } else if (this.chosenAction === "late") {
                    absenceCreate.late(collected, this.restriction, responceList);
                } else if (this.chosenAction === "ontime") {
                    absenceCreate.ontime(collected, this.restriction, responceList);
                } else if (this.chosenAction === "present") {
                    absenceCreate.present(collected, this.restriction, responceList);
                }
            };
            doTheThing().then(() => {
                this.askIfSomethingElse(DM, name);
            });
        }
    }

    //// Ontime and Present ////
    chooseOntimeOrPresent(DM, name) {
        this.chosenAction = "";
        this.restriction = "";
        const ontime_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content:
                "\n \nWhat would you like to do?\n \n\t1. Say I'll Be **On-Time** \n\t2. Say I'll Be **Present**\n\tM. **Main Menu**\n\tQ. **Quit**",
        });

        ontime_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["1", "2", "m", "M", "q", "Q"];
            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM, m.content);
                }
            }
            switch (m.content) {
                case "1":
                    this.chosenAction = "ontime";
                    ontime_collector.stop("one_chosen");
                    break;
                case "2":
                    this.chosenAction = "present";
                    ontime_collector.stop("two_chosen");
                    break;
                case "m" || "M":
                    ontime_collector.stop("menu");
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
                this.absenceSingleOrRangeCollection(DM, name);
            } else if (reason === "menu") {
                this.backToMainMenu(DM, name);
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }

    //// Utils ////
    backToMainMenu(DM, name) {
        DM.channel.send({
            content:
                "Please choose the number that corresponds to what you want to do.\n  \n\t1. **Show/Cancel** Existing Entries\n\t2. Say You'll Be **Absent** or **Late**...\n\tQ. **Quit**",
        });
        this.handleSomethingElse(DM, name);
    }
    sorryTryAgain(DM) {
        DM.channel.send({
            content:
                "Sorry, I don't know what to do with that input. Please check the instructions and enter something else. ~🐢",
        });
    }

    noAbsencesOrLateFound(DM, name) {
        DM.channel.send({
            content: "Nothing to cancel! ~ 🐢",
        });
        this.askIfSomethingElse(DM, name);
    }

    askIfSomethingElse(DM, name) {
        const otherwise_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        DM.channel.send({
            content: "\n \nWould you like to do something else? (**y**/**n**)\n",
        });

        otherwise_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["y", "Y", "n", "N"];
            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM);
                }
            }
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
                this.handleSomethingElse(DM, name);
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

    handleSomethingElse(DM, name) {
        var response = "";
        const otherwise_yes_collector = DM.channel.createMessageCollector({
            time: 30000,
        });

        otherwise_yes_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["1", "2", "q", "Q"];
            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM);
                }
            }
            switch (m.content) {
                case "1":
                    otherwise_yes_collector.stop("one");
                    break;
                case "2":
                    otherwise_yes_collector.stop("two");
                    break;
                case "q" || "Q":
                    otherwise_yes_collector.stop("user");
                    break;
            }
        });

        otherwise_yes_collector.on("end", (collected, reason) => {
            if (reason === "one") {
                response = absenceDBHelper.show(name, "mine", "short");
                DM.channel.send({
                    embeds: [response.absentEmbed, response.lateEmbed],
                });
                if ((response.absentCount || response.lateCount) > 0) {
                    this.chooseOntimeOrPresent(DM, name);
                } else {
                    this.noAbsencesOrLateFound(DM, name);
                }
            } else if (reason === "two") {
                this.absenceMenuCollection(DM, name);
            } else if (reason === "time") {
                DM.channel.send({
                    content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                });
            } else if (reason === "user") {
                DM.channel.send({
                    content: "Ok, see you!",
                });
            }
        });
    }
}

module.exports = {
    attendanceTools,
};
