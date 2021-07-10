//Load the config file.
require("dotenv").config();
const prefix = process.env.prefix;

module.exports = {
    name: 'help',
    description: 'Learn more about Speedybot commands!',
    usage: '[optional command name]',
    notes: '',
    execute(message, args) {
        const data = [];
		const { commands } = message.client;

        if (!args.length) {
			data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command. ~~🐢`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
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