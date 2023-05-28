const { ChannelType } = require("discord.js");

module.exports = {
    name: "ontime",
    description: "Tell us you will not be late to raid!",
    usage: "[Month Day Month Day]",
    notes: "[Deprecated] This command cancels out an entry made with !late.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Example:** `!ontime July 4` (Ontime on July 4 -- marks you on-time for just that date)\n**Date Range Example:** `!ontime Jul 4 Jul 21` (Ontime from July 4 until July 21 -- removes any lateness that matches this start and end date.",
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
