const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("speedy").setDescription("Learn more about Speedybot commands!"),
    async execute(interaction) {
        const response = "Speedy Reference Manual:\n\n**__Things we can all see__:**\n- **/askspeedy**: Need a guaranteed helpful answer? Ask away.\n- **/cats**: Need a cat right now? Let's get one from the Internet...\n- **/dogs**: We've got 'em!  You can also use `/dogs corgi` to get a corgi.\n- **/foxes**: How about a fox instead? To the Internet!\n- **/logs**: Want the link to the logs?\n- **/miniwheat**: Why not flip a mini-wheat?\n- **/roll**: D&D style dice roller (Examples: `/roll 1d4 + 1`, `/roll 1d4 - 1`, `/roll 1d4 * 2`, `/roll 1d20`)\n- **/sheep**: Need CC? Speedy's got you.\n- **/xkcd**: Read a random comic...\n\n**__Things only you see__:** (Note: Only correctly formatted Attendance info gets posted to #attendance. Mistakes are hidden.)\n- **/absences**: See known absences.\n- **/astro**: See the NASA Astronomy Picture of the Day\n- **/attendance**: Manages all things attendance. :turtle:\n- **/adventure**: Want a real Adventure?\n- **/corkboard**: Where's the website? What's the password?\n- **/raidbrigade**: Need the code for the in-game channel?\n- **/rules**: Read the Raid Rules!\n- **/sourcecode**: View my source code.\n- **/speedy**: See this help message.\n- **/strats**: Did you read the strat?\n\nWant something else? Ask Doolan. ~~ :turtle:";
        interaction.reply({ content: response, ephemeral: true });
    },
};
