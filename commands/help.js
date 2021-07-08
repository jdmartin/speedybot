//Load the config file.
require("dotenv").config();
const prefix = process.env.prefix;

module.exports = {
    name: 'help',
    description: 'Learn more about Speedybot commands!',
    usage: '[optional command name]',
    execute(message, args) {
        const data = [];
		const { commands } = message.client;

        if (!args.length) {
            const response = (`To find out how to use a command, type \`!help [command]\`. ~~ 🐢
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
            if (command.notes) data.push(`**Notes:** ${command.notes}`);

            if (message.channel.type === 'dm') {
                message.reply(data, { split: true })
            } else {
                message.member.send(data, { split: true })
            }
        }
    },
};