module.exports = {
    name: 'speedyhelp',
    description: 'How can Speedy help you?',
    notes: "This advice is to help you see embeds in Discord.  You don't _have_ to do this.",
    execute(message, args) {
        const advice = (`Hello!  So, here's a bit of help:\n
        __Setup__\n
        Some of the commands (!strats, some planned ones) use the embeds feature to present things in a nicer way.
        
        If you can't see these, and you'd like to, do this:
        \`\`\`
        1. Open your settings via the gear at the bottom.
        2. Go to Text & Images
        3. Enable 'Link Preview.'\`\`\`
        If you don't want to do that, it's ok.  I've implemented a simple view of strats (!simplestrats), and 
        will do so with new commands as possible.

        Other questions? Reach out to Doolan.
        🐢
    `)
    
        if (message.channel.type === 'dm') {
            message.reply(advice)
        } else {
            message.member.send(advice)
        }
    },
};