const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("speedy").setDescription("Learn more about Speedybot commands!"),
    async execute(interaction) {
        const response = `Hello!  Here are some things I can do (commands work here or in chat):\n
            __Remember: All commands start with a **/**__\n
            **adventure**: Want a real Adventure?
            **askspeedy**: Need a *guaranteed* helpful answer? Ask away.
            **cats**: Need a cat right now? Let's get one from the Internet...
            **corkboard**: Where's the website? What's the password?
            **dogs**: We've got 'em!  You can also use '/dog corgi' to get a corgi.
            **foxes**: How about a fox instead? To the Internet!
            **logs**: Want the link to the logs?
            **miniwheat**: Why not flip a mini-wheat?
            **next**: What are we doing?
            **raidbrigade**: Need the code for the in-game channel?
            **rules**: Read the Raid Rules!
            **sheep**: Need CC? Speedy's got you.
            **speedysource**: View my source code.
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
