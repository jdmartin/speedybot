module.exports = {
    name: 'cats',
    description: 'See a random cat!',
    execute(message, args) {

        const {
            file
        } = await fetch('https://aws.random.cat/meow').then(response => {
            return response.json();
        });

        message.member.send(file);
    },
};