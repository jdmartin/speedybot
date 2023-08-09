require("dotenv").config();
const utils = require("../utils/speedyutils.js");
const client = utils.client;

async function asyncGetName(message) {
    const guild = client.guilds.cache.get(process.env.guild_id);
    const member = await guild.members.fetch(message.author.id);
    var the_nickname = "";
    if (member.nickname) {
        the_nickname = member.nickname;
    } else {
        the_nickname = member.user.username;
    }
    return the_nickname
}

module.exports = {
    asyncGetName,
};
