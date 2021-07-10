module.exports = {
    name: 'rules',
    description: 'Rules for Raiding!',
    usage: '',
    notes: '',
    execute(message, args) {
        message.reply('Here are the raid rules:', {
            files: [
                "./resources/images/rules.png"
            ]
        });
    },
};