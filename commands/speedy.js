module.exports = {
    name: 'speedy',
    description: 'Speedy!',
    execute(message, args) {
        const fs = require('fs');
        var textFile = fs.readFileSync('resources/speedy.txt', {
            "encoding": "utf-8"
        });
        message.channel.send(textFile)
    },
};