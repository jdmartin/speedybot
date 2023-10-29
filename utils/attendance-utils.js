const { EmbedBuilder } = require("discord.js");

const absence = require("../utils/absencedb.js");
const absenceCreate = new absence.AttendanceTools();
const absenceSlash = require("../utils/absencedb-slash.js");
const absenceDBHelper = new absenceSlash.DataDisplayTools();
const quickHelper = new absenceSlash.AttendanceTools();
const dates = require("./datetools.js");
const dateHelper = new dates.dateTools();

class attendanceTools {
    constructor() {
        this.Responses = [];
        this.counter = 0;
        this.chosenAction = "";
        this.bypassList = ["ontime", "present"];
        this.restriction = "";

        // prettier-ignore
        this.goodMonthResponses = [
            "01", "1", "02", "2", "03", "3", "04", "4", "05", "5", "06", "6", "07", "7", "08", "8", "09", "9", "10", "11", "12", "q", "Q",
        ];

        this.months = {
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

        this.monthMenu =
            "\n\t**1**.\t January\n\t**2**.\t February\n\t**3**.\t March\n\t**4**.\t April\n\t**5**.\t May\n\t**6**.\t June\n\t**7**.\t July\n\t**8**.\t August\n\t**9**.\t September\n\t**10**.\tOctober\n\t**11**.\tNovember\n\t**12**.\tDecember\n";
    }

    absenceMenuCollection(DM, name) {
        this.chosenAction = "";
        this.restriction = "";
        const absence_collector = DM.channel.createMessageCollector({
            time: 120000,
        });

        DM.channel.send({
            content:
                "\n \nWhat would you like to do?\n \n\t1) Add an **Absence** \n\t2) Say I'll Be **Late**\n\n\tM) **Main Menu**\n\tQ. **Quit**",
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
                case "m":
                case "M":
                    absence_collector.stop("menu");
                case "q":
                case "Q":
                    absence_collector.stop("user");
                    break;
            }
        });

        absence_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "one_chosen":
                    this.absenceSingleOrRangeCollection(DM, name);
                    break;
                case "two_chosen":
                    this.absenceSingleOrRangeCollection(DM, name);
                    break;
                case "menu":
                    this.backToMainMenu(DM, name);
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
            }
        });
    }

    absenceSingleOrRangeCollection(DM, name) {
        this.counter = 0;
        this.Responses = [];
        const asr_collector = DM.channel.createMessageCollector({
            time: 120000,
        });

        DM.channel.send({
            content:
                "\nOk, so, is this:\n \n\t1) A **Single** Date?\n\t2) A **Range** of Dates?\n\n\t3) Recurring (**Tuesdays**)?\n\t4) Recurring (**Thursdays**)?\n\t5) Recurring (**Sundays**)?\n\t\n\tM) **Main Menu**\n\tQ) **Quit**",
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
                case "m":
                case "M":
                    asr_collector.stop("menu");
                    break;
                case "q":
                case "Q":
                    asr_collector.stop("user");
                    break;
            }
        });
        asr_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "single":
                    this.Responses.push("single");
                    this.absenceMonthCollection(DM, name);
                    break;
                case "range":
                    this.Responses.push("range");
                    this.absenceMonthCollection(DM, name);
                    break;
                case "menu":
                    this.backToMainMenu(DM, name);
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
            }
        });
    }

    absenceMonthCollection(DM, name) {
        const amc_collector = DM.channel.createMessageCollector({
            time: 120000,
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
                } else if (!dateHelper.checkIsMonth(m.content)) {
                    this.sorryTryAgain(DM, m.content);
                    amc_collector.stop("error");
                } else if (dateHelper.checkIsMonth(m.content)) {
                    tempMonth = this.monthFilterGuardrail(m.content);
                    amc_collector.stop("validMonth");
                }
            }
        });

        amc_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "error":
                    this.absenceMonthCollection(DM, name);
                    break;
                case "validMonth":
                    this.Responses.push(this.months[tempMonth]);
                    this.absenceDayCollection(DM, name);
                    break;
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
            }
        });
    }

    absenceDayCollection(DM, name) {
        const adc_collector = DM.channel.createMessageCollector({
            time: 120000,
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
                } else if (dateHelper.checkIsDayOfMonth(m.content)) {
                    let dayTest = this.testIsRaidDay(DM, m.content);
                    if (this.Responses[0] === "single") {
                        if (dayTest === true) {
                            tempDay = m.content;
                            theMessage = m;
                            this.counter += 1;
                            adc_collector.stop("validDate");
                        } else {
                            adc_collector.stop("no_raid");
                        }
                    } else if (this.Responses[0] === "range") {
                        tempDay = m.content;
                        theMessage = m;
                        this.counter += 1;
                        adc_collector.stop("validDate");
                    }
                } else {
                    adc_collector.stop("error");
                }
            }
        });

        adc_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "validDate":
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
                    break;
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
                case "no_raid":
                    this.invalidRaidDay(DM);
                    this.absenceDayCollection(DM, name);
                    break;
                case "error":
                    this.sorryTryAgain(DM);
                    this.absenceDayCollection(DM, name);
                    break;
            }
        });
    }

    absenceCommentCollection(DM, name) {
        const acc_collector = DM.channel.createMessageCollector({
            time: 120000,
        });

        var comment = "";
        var theMessage = "";

        DM.channel.send({
            content: `Please enter a comment`,
        });

        acc_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            if (m.content && m.author.bot === false) {
                comment = `"${m.content}"`;
                theMessage = m;
                acc_collector.stop("validComment");
            }
        });

        acc_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "validComment":
                    this.Responses.push(comment);
                    if (this.Responses[0] === "single") {
                        this.absenceProcessSingle(theMessage, DM, name);
                    } else if (this.Responses[0] === "range") {
                        this.absenceProcessRange(theMessage, DM, name);
                    }
                    break;
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
            }
        });
    }

    absenceProcessSingle(collected, DM, name) {
        if (this.Responses[0] === "single") {
            let responceList = [this.Responses[1], this.Responses[2], this.Responses[3]];

            const doTheThing = async () => {
                switch (this.chosenAction) {
                    case "absent":
                        absenceCreate.absent(collected, this.restriction, responceList);
                        break;
                    case "late":
                        absenceCreate.late(collected, this.restriction, responceList);
                        break;
                    case "ontime":
                        absenceCreate.ontime(collected, this.restriction, responceList);
                        break;
                    case "present":
                        absenceCreate.present(collected, this.restriction, responceList);
                        break;
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
                switch (this.chosenAction) {
                    case "absent":
                        absenceCreate.absent(collected, this.restriction, responceList);
                        break;
                    case "late":
                        absenceCreate.late(collected, this.restriction, responceList);
                        break;
                    case "ontime":
                        absenceCreate.ontime(collected, this.restriction, responceList);
                        break;
                    case "present":
                        absenceCreate.present(collected, this.restriction, responceList);
                        break;
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
            time: 120000,
        });

        DM.channel.send({
            content:
                "\n \nWhat would you like to do?\n \n\t1) Say I'll Be **On-Time** \n\t2) Say I'll Be **Present**\n\n\tM) **Main Menu**\n\tQ) **Quit**",
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
                case "m":
                case "M":
                    ontime_collector.stop("menu");
                    break;
                case "q":
                case "Q":
                    ontime_collector.stop("user");
                    break;
            }
        });

        ontime_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "one_chosen":
                    this.absenceSingleOrRangeCollection(DM, name);
                    break;
                case "two_chosen":
                    this.absenceSingleOrRangeCollection(DM, name);
                    break;
                case "menu":
                    this.backToMainMenu(DM, name);
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
            }
        });
    }

    quickAbsentOrLateAdd(DM, name, attendance_type) {
        if (attendance_type === "absent") {
            this.chosenAction = "absent";
        } else if (attendance_type === "late") {
            this.chosenAction = "late";
        }

        const thisDate = new Date().toLocaleString("en-US", { timeZone: 'America/Los_Angeles' });
        const thisDateObject = new Date(thisDate);
        // Many functions rely on older code that expects user input. So, we convert to month name.
        const thisMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(thisDateObject);
        const thisDay = thisDateObject.getDate();

        //These Responses are used in the process command called from absenceCommentCollection() below.
        this.Responses.push("single"); //To keep things in the expected order.
        this.Responses.push(thisMonth);
        this.Responses.push(thisDay.toString());

        if (!this.testIsRaidDay(DM, thisDay)) {
            DM.channel.send({
                content: "No raid today! 🐢"
            });
            this.askIfSomethingElse(DM, name);
        } else {
            const quick_abs_collector = DM.channel.createMessageCollector({
                time: 120000,
            });

            DM.channel.send({
                content:
                    "\n \nChoose an option...\n \n\tC) **Add A Comment to Finish**\n\tM) **Main Menu**\n\tQ) **Quit**",
            });

            quick_abs_collector.on("collect", (m) => {
                //Triggered when the collector is receiving a new message
                let validAnswers = ["c", "C", "m", "M", "q", "Q"];

                if (m.content && m.author.bot === false) {
                    if (!validAnswers.includes(m.content)) {
                        this.sorryTryAgain(DM, m.content);
                    } else if (m.content === "c" || m.content === "C") {
                        quick_abs_collector.stop("comment_needed");
                    } else if (m.content === "m" || m.content === "M") {
                        quick_abs_collector.stop("menu");
                    } else if (m.content === "q" || m.content === "Q") {
                        quick_abs_collector.stop("user");
                    }
                }
            });

            quick_abs_collector.on("end", (collected, reason) => {
                switch (reason) {
                    case "time":
                        DM.channel.send({
                            content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                        });
                        break;
                    case "comment_needed":
                        this.absenceCommentCollection(DM, name);
                        break;
                    case "menu":
                        this.backToMainMenu(DM, name);
                        break;
                    case "user":
                        DM.channel.send({
                            content: "Ok, see you!",
                        });
                        break;
                }
            });
        }
    }

    quickAbsentOrLateCancel(DM, name, absenceList, lateList, rawList) {
        var theSelection = '';
        const quick_collector = DM.channel.createMessageCollector({
            time: 120000,
        });

        DM.channel.send({
            content:
                "\n \nYou can enter the number of the item you'd like to remove, or...\n \n\tM) **Main Menu**\n\tQ) **Quit**",
        });

        quick_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["m", "M", "q", "Q"];
            for (var i = 0; i < rawList.length; i++) {
                validAnswers.push(i.toString());
            }

            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM, m.content);
                } else if (m.content === "m" || m.content === "M") {
                    quick_collector.stop("menu");
                } else if (m.content === "q" || m.content === "Q") {
                    quick_collector.stop("user");
                } else {
                    theSelection = parseInt(m.content);
                    quick_collector.stop("valid_choice");
                }
            }
        });

        quick_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "valid_choice":
                    if (theSelection > absenceList.length - 1) {
                        this.confirmQuickDelete(name, rawList[theSelection], "late", DM);
                    } else if (theSelection <= absenceList.length - 1) {
                        this.confirmQuickDelete(name, rawList[theSelection], "absence", DM);
                    }
                    break;
                case "two_chosen":
                    this.absenceSingleOrRangeCollection(DM, name);
                    break;
                case "menu":
                    this.backToMainMenu(DM, name);
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
            }
        });
    }

    //// Utils ////
    backToMainMenu(DM, name) {
        DM.channel.send({
            content:
                "Please choose the number that corresponds to what you want to do.\n  \n\t0) **Quickly Cancel** An Existing Entry\n\t1) **Show/Cancel** Existing Entries\n\t2) Say You'll Be **Absent** or **Late**...\n\n\tC) **Quickly Cancel** An Existing Entry\n\tA) **Quick Absence**: Mark Today As Absent\n\tL) **Quick Late**: Mark Today As Late\n\n\tQ) **Quit**\n\tQ) **Quit**",
        });
        this.handleSomethingElse(DM, name);
    }

    sorryTryAgain(DM) {
        DM.channel.send({
            content:
                "Sorry, I don't know what to do with that input. Please check the instructions and enter something else. ~🐢",
        });
    }

    invalidRaidDay(DM) {
        DM.channel.send({
            content:
                "Sorry, that's not a raid day (Tue, Thu, or Sun). Please check the date and enter something else. ~🐢",
        });
    }

    monthFilterGuardrail(month) {
        let filterableMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];

        if (filterableMonths.includes(month)) {
            let newMonth = month.replace("0", "");
            return newMonth;
        } else {
            return month;
        }
    }

    noAbsencesOrLateFound(DM, name) {
        DM.channel.send({
            content: "Nothing to cancel! ~ 🐢",
        });
        this.askIfSomethingElse(DM, name);
    }

    testIsRaidDay(DM, day) {
        //This is really only needed for single dates, as range does this stuff.
        let year = dateHelper.determineYear(this.Responses[1], day);
        let month = this.Responses[1];
        let combinedStartDate = month + " " + day + " " + year;

        //Returns true or false
        let theDate = dateHelper.validateRaidDate(DM, combinedStartDate);
        if (theDate === true) {
            return true;
        } else if (theDate === false) {
            return false;
        }
    }

    askIfSomethingElse(DM, name) {
        const otherwise_collector = DM.channel.createMessageCollector({
            time: 120000,
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
                case "y":
                case "Y":
                    otherwise_collector.stop("yes");
                    break;
                case "n":
                case "N":
                    otherwise_collector.stop("no");
                    break;
            }
        });

        otherwise_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "yes":
                    DM.channel.send({
                        content:
                            "Please choose the number that corresponds to what you want to do.\n  \n\t0) **Quickly Cancel** An Existing Entry\n\t1) **Show/Cancel** Existing Entries\n\t2) Say You'll Be **Absent** or **Late**...\n\n\tC) **Quickly Cancel** An Existing Entry\n\tA) **Quick Absence**: Mark Today As Absent\n\tL) **Quick Late**: Mark Today As Late\n\n\tQ) **Quit**",
                    });
                    this.handleSomethingElse(DM, name);
                    break;
                case "no":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
            }
        });
    }

    handleSomethingElse(DM, name) {
        var response = "";
        const otherwise_yes_collector = DM.channel.createMessageCollector({
            time: 120000,
        });

        otherwise_yes_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["1", "2", "c", "C", "a", "A", "l", "L", "q", "Q"];
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
                case "a":
                case "A":
                    otherwise_yes_collector.stop("quick_absent");
                    break;
                case "c":
                case "C":
                    otherwise_yes_collector.stop("quick_cancel");
                    break;
                case "l":
                case "L":
                    otherwise_yes_collector.stop("quick_late");
                    break;
                case "q":
                case "Q":
                    otherwise_yes_collector.stop("user");
                    break;
            }
        });

        otherwise_yes_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "one":
                    response = absenceDBHelper.show(name, "mine", "short");
                    DM.channel.send({
                        embeds: [response.absentEmbed, response.lateEmbed],
                    });
                    if ((response.absentCount || response.lateCount) > 0) {
                        this.chooseOntimeOrPresent(DM, name);
                    } else {
                        this.noAbsencesOrLateFound(DM, name);
                    }
                    break;
                case "quick_absent":
                    this.quickAbsentOrLateAdd(DM, name, "absent");
                    break;
                case "quick_cancel":
                    response = absenceDBHelper.showForAttendanceManagement(name);
                    if ((response.absentCount || response.lateCount) > 0) {
                        DM.channel.send({
                            embeds: [response.absAndLateEmbed],
                        });
                        this.quickAbsentOrLateCancel(DM, name, response.absenceList, response.lateList, response.rawList);
                    } else {
                        this.noAbsencesOrLateFound(DM, name);
                    }
                    break;
                case "quick_late":
                    this.quickAbsentOrLateAdd(DM, name, "late");
                    break;
                case "two":
                    this.absenceMenuCollection(DM, name);
                    break;
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
                case "user":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
            }
        });
    }

    confirmQuickDelete(name, date, category, DM) {
        const quickConfirm_collector = DM.channel.createMessageCollector({
            time: 120000,
        });

        DM.channel.send({
            content: `\n \nWould you like to remove the entry for ${dateHelper.makeFriendlyDates(date)}? (**y**/**n**)\n`,
        });

        quickConfirm_collector.on("collect", (m) => {
            //Triggered when the collector is receiving a new message
            let validAnswers = ["y", "Y", "n", "N"];
            if (m.content && m.author.bot === false) {
                if (!validAnswers.includes(m.content)) {
                    this.sorryTryAgain(DM);
                }
            }
            switch (m.content) {
                case "y":
                case "Y":
                    quickConfirm_collector.stop("yes");
                    break;
                case "n":
                case "N":
                    quickConfirm_collector.stop("no");
                    break;
            }
        });

        quickConfirm_collector.on("end", (collected, reason) => {
            switch (reason) {
                case "yes":
                    if (category === "late") {
                        quickHelper.quickOntime(name, date);
                        // We can use the same date twice since we're only removing singles and not ranges.
                        absenceCreate.removeSpeedyMessage(name, date, date, "late");
                    } else if (category === "absence") {
                        quickHelper.quickPresent(name, date);
                        absenceCreate.removeSpeedyMessage(name, date, date, "absent");
                    }
                    DM.channel.send({
                        content:
                            "\n\tDone.\n  \n\t0) **Quickly Cancel** An Existing Entry\n\t1) **Show/Cancel** Existing Entries\n\t2) Say You'll Be **Absent** or **Late**...\n\tQ) **Quit**",
                    });
                    this.handleSomethingElse(DM, name);
                    break;
                case "no":
                    DM.channel.send({
                        content: "Ok, see you!",
                    });
                    break;
                case "time":
                    DM.channel.send({
                        content: `Sorry, we ran out of time. Please try again when you're feeling more, uh, Speedy...`,
                    });
                    break;
            }
        });
    }
}

module.exports = {
    attendanceTools,
};
