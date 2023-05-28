const { ChannelType } = require("discord.js");

module.exports = {
    name: "absent",
    description: "Tell us you will miss raid!",
    usage: "[Month Day Month Day Comment]",
    notes: '[Deprecated] This command marks you absent on a given day, or for a range of dates, and allows you to supply a comment. It will then post this to the attendance channel for you.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Single Date Example:** `!absent July 4 Feeding Clara` (Absent on July 4 -- marks you absent for just that date and supplies the reason "Feeding Clara")\n**Date Range Example:** `!absent July 4 July 11 Doing Side Quests` (Absent from July 4 until July 11th (inclusive) and supplies the reason "Doing Side Quests")',
    execute(message) {
        const response =
            "Hey, friend. In keeping with the way Discord is heading (https://support-dev.discord.com/hc/en-us/articles/6025578854295-Why-We-Moved-to-Slash-Commands), we've moved on to `/attendance`.\n\nThe good news is that it shouldn't allow for wrong answers, happens away from prying eyes (like this message), and only posts when you give it correct answers.\n\nAsk Doolan if you have questions or suggestions. ~🐢";
        if (message.channel.type === ChannelType.DM) {
            message.channel.send(response);
        } else {
            message.member.send(response);
        }
    },
};
