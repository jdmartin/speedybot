module.exports = {
    name: 'strats',
    description: 'Get all the links to strats for the current raid, or for an older raid.',
    usage: '[optional raid name]',
    notes: 'Right now, the only optional names are: nathria and sanctum',
    execute(message, args) {
        const Shadowlands =  require('../resources/strats/shadowlands.js');
        
        if (!args.length) {
            message.channel.send({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Shadowlands.sepulchre]
            });
        } else if (args[0].toLowerCase() === 'sanctum') {
            message.channel.send({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Shadowlands.sanctum]
            });
        } else if (args[0].toLowerCase() === 'nathria') {
            message.channel.send({
                content: "It's dangerous to go alone!  Take these:\n\n(If you don't see anything, try `!simplestrats` or `!speedyhelp`.)",
                embeds: [Shadowlands.nathria]
            });
        }
    },
};