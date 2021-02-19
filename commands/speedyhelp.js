module.exports = {
    name: 'speedyhelp',
    description: 'How can Speedy help you?',
    execute(message, args) {
        const strats = (`Hello!  So, here's a bit of help:\n
        __Setup__\n
        Some of the commands (!strats, !xkcd) use the embeds feature to present things in a nicer way.
        
        If you can't see these, and you'd like to, do this:
        \`\`\`
        1. Open your settings via the gear at the bottom.
        2. Go to Text & Images
        3. Enable 'Link Preview.'\`\`\`
        If you don't want to do that, it's ok.  I've implemented a simple view of strats (!simplestrats), and 
        will work on a solution for xkcd.

        Other questions? Reach out to Doolan.
        🐢
    `)
    
        if (message.channel.type === 'dm') {
            message.reply(strats)
        } else {
            message.member.send(strats)
        }
    },
};