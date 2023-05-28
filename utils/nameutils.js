require("dotenv").config();
const utils = require("../utils/speedyutils.js");
const client = utils.client;

function asyncGetName(message) {
    const guild = client.guilds.cache.get(process.env.guild_id);
    return Promise.resolve(guild.members.fetch(message.author.id));
}

module.exports = {
    asyncGetName,
};
