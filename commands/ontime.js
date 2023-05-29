const { ChannelType } = require("discord.js");

module.exports = {
    name: "ontime",
    description: "Tell us you will not be late to raid!",
    usage: "[Month Day Month Day]",
    notes: "[Deprecated] This command cancels out an entry made with !late.\nYou can write the whole month, or use the first three letters. Single dates can be with or without the zero. (6 or 06 is fine.)\n**Example:** `!ontime July 4` (Ontime on July 4 -- marks you on-time for just that date)\n**Date Range Example:** `!ontime Jul 4 Jul 21` (Ontime from July 4 until July 21 -- removes any lateness that matches this start and end date.",
    execute(message) {
        const response = `Hey, friend.\n\nIn keeping with changes to Discord, !${this.name} is now **/attendance**.\n\nIt works in secret (like Speedy) and only takes right answers.\n\nIf you're the curious type, you can read more about Discord's changes here: <https://support-dev.discord.com/hc/en-us/articles/6025578854295-Why-We-Moved-to-Slash-Commands>.\n ~🐢`;
        if (message.channel.type === ChannelType.DM) {
            message.channel.send(response);
        } else {
            message.member.send(response);
        }
    },
};
