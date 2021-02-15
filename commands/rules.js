module.exports = {
    name: 'rules',
    description: 'Rules for Raiding!',
    execute(message, args) {
        message.member.send('Here are the raid rules:', {
            files: [
                "./resources/images/rules.png"
            ]
        });
    },
};