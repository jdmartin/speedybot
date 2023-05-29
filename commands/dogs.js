const { ChannelType } = require("discord.js");

module.exports = {
    name: "dogs",
    description: "See a random dog!",
    aliases: ["dog"],
    usage: "[optional dog breed]",
    notes: "These are the breeds you can use: cardigan, corgi, germanshepherd, husky, pembroke, and poodle.\nDogs courtesy of https://dog.ceo/dog-api/",
    execute(message) {
        const response = `Hey, friend.\n\nIn keeping with changes to Discord, !${this.name} is now **/${this.name}**.\n\nIf you're the curious type, you can read more about Discord's changes here: <https://support-dev.discord.com/hc/en-us/articles/6025578854295-Why-We-Moved-to-Slash-Commands>.\n ~🐢`;
        if (message.channel.type === ChannelType.DM) {
            message.channel.send(response);
        } else {
            message.member.send(response);
        }
    },
};
