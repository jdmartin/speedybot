const { ChannelType } = require("discord.js");

module.exports = {
    name: "absences",
    description: "Show absences",
    usage: "[option]",
    notes: "Shows you known absences, and declared lateness, with their comments in a concise format.\nOptionally, you can say `!absences mine` to see just your own absences and declared lateness, or `!absences today` to see posts from anyone for today.",
    execute(message) {
        const response = `Hey, friend.\n\nIn keeping with changes to Discord, !${this.name} is now **/${this.name}**.\n\nIf you're the curious type, you can read more about Discord's changes here: <https://support-dev.discord.com/hc/en-us/articles/6025578854295-Why-We-Moved-to-Slash-Commands>.\n ~🐢`;
        if (message.channel.type === ChannelType.DM) {
            message.channel.send(response);
        } else {
            message.member.send(response);
        }
    },
};
