//Load the config file.
require("dotenv").config();
const prefix = process.env.prefix;

module.exports = {
    name: 'help',
    description: 'Learn more about Speedybot commands!',
    usage: '[optional command name]',
    notes: '',
    execute(message, args) {
        const helpData = [];
        const {
            commands
        } = message.client;

        if (!args.length) {
            helpData.push('Here\'s a list of all my commands:');
            helpData.push(commands.map(command => command.name).join(', '));
            helpData.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command. ~~🐢`);
            if (message.channel.type === 'DM') {
                return message.reply(helpData.join('\n'));
            } else {
                return message.member.send(helpData.join('\n'));
            }
        }

        if (args.length) {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            helpData.push(`**Name:** ${command.name}`);
            if (command.aliases) helpData.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) helpData.push(`**Description:** ${command.description}`);
            if (command.usage) helpData.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
            if (command.notes) helpData.push(`**Notes:** ${command.notes}`);

            if (message.channel.type === 'DM') {
                message.reply(helpData.join('\n'));
            } else {
                message.member.send(helpData.join('\n'));
            }
        }
    }
};