module.exports = {
    name: 'rules',
    description: 'Rules for Raiding!',
    usage: '',
    notes: '',
    execute(message) {
        message.channel.send({
            content: 'Here are the raid rules:',
            files: [
                "./resources/images/rules.png"
            ]
        });
    },
};