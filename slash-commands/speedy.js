const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("speedy").setDescription("Learn more about Speedybot commands!"),
    async execute(interaction) {
        const response = `Hello!  Here are some things I can do:\n
            __Remember: All commands start with a **/**__\n
            **adventure**: Want a real Adventure?
            **askspeedy**: Need a *guaranteed* helpful answer? Ask away.
            **astro**: See NASA's Astronomy Picture of the Day!
            **cats**: Need a cat right now? Let's get one from the Internet...
            **corkboard**: Where's the website? What's the password?
            **cows**: Mooooooo!  MOO!
            **dogs**: We've got 'em!  You can also use '/dog corgi' to get a corgi.
            **foxes**: How about a fox instead? To the Internet!
            **logs**: Want the link to the logs?
            **miniwheat**: Why not flip a mini-wheat?
            **raidbrigade**: Need the code for the in-game channel?
            **roll**: A Dice roller. (Examples: /roll 1d20, /roll 1d20 + 1, /roll 2d20 - 3, /roll 6d6 * 2)
            **rules**: Read the Raid Rules!
            **sheep**: Need CC? Speedy's got you.
            **sourcecode**: View my source code.
            **strats**: Did you read the strat?
            **xkcd**: Read a random comic...\n\n
            __Attendance-related Commands__:
            **absences**: See known absences.
            **attendance**: Manage your raid attendance.

            Want something else? Ask Doolan. ~~ 🐢
        `;
        interaction.reply({ content: response, ephemeral: true });
    },
};
