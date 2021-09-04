module.exports = {
    name: 'simplenext',
    description: 'What are we doing?',
    execute(message, args) {
        const strats = (`Hello!  Here are links to Evie's raid annoucements:\n
        __Immediate__\n
        **Posted July 6**: https://discord.com/channels/308622057707536385/308625441546043402/862183558839533579\n
        __Planning__
        **The Burning Reconquista**: https://discord.com/channels/308622057707536385/308625441546043402/839871852045664337\n
        __Reminders__
        Don't forget to check the #annoucements channel for more stuff!
        🐢
    `)
    
        if (message.channel.type === 'DM') {
            message.reply(strats)
        } else {
            message.member.send(strats)
        }
    },
};
