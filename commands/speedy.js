module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    aliases: ['help'],
    usage: '[command name]',
    execute(message, args) {
        const data = [];
		const { commands } = message.client;
        
        if (!args.length) {
            const response = (`Hello!  Here are some things I can do (commands work here or in chat):\n
            __Remember: All commands start with a **!**__\n
            **adventure**: Want a real Adventure?
            **askspeedy**: Need a *guaranteed* helpful answer? Ask away.
            **cats**: Need a cat right now? Let's get one from the Internet...
            **dogs**: We've got 'em!  You can also use '!dog corgi' to get a corgi.
            **foxes**: How about a fox instead? To the Internet!
            **logs**: Want the link to the logs?
            **miniwheat**: Why not flip a mini-wheat?
            **next**: What are we doing?
            **raidbrigade**: Need the code for the in-game channel?
            **rules**: Read the Raid Rules!
            **sheep**: Need CC? Speedy's got you.
            **speedysource**: View my source code.
            **strats**: Did you read the strat?
            **xkcd**: Read a random comic...\n
            __Attendance-related Commands__:
            **absences**: See known absences.
            **absent**: Let us know you won't be raiding. (Example: !absent 2021-07-04 Comment)
            **late**: Let us know you're running late. (Example: !late 2021-07-04 Comment)
            **ontime**: Cancels late. (Example: !ontime 2021-07-04)
            **present**: Cancel an absence. (Example: !present 2021-07-04)\n
            Some examples:
            (N.B. You can use commas or not after days, and you can use either three-letter months or the whole word.)
            !absent July 4, 2021 (Absent on July 4, 2021)
            !absent Jul 6 2021 Jul 13 2021 Working on stuff. (Absent from July 6 until July 13, 2021 with reason.)
            !late July 4 2021 Running Marathon (Late on July 4, 2021 with reason.)
            !ontime Jul 4, 2021 (On-time on July 4, 2021 -- removes the late for that date)
            !present July 4, 2021 (Present on July 4, 2021 -- removes an absence for just that date)\n
            Want something else? Ask Doolan. ~~ 🐢
        `)
            if (message.channel.type === 'dm') {
                message.reply(response)
            } else {
                message.member.send(response)
            }
        }
        if (args.length) {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            
            data.push(`**Name:** ${command.name}`);

            if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
    		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

            if (message.channel.type === 'dm') {
                message.reply(data, { split: true })
            } else {
                message.member.send(data, { split: true })
            }
        }
    },
};