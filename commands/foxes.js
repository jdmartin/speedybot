module.exports = {
    name: 'foxes',
    description: 'See a random fox!',
    usage: '',
    notes: 'Foxes from https://randomfox.ca/',
    execute(message) {
        const https = require("https");
        (async function () {
            const {
                image
            } = https.get('https://randomfox.ca/floof/', res => {
                res.setEncoding("utf8");
                let body = '';
                res.on("data", data => {
                    body += data;
                });
                res.on("end", () => {
                    var bodyParsed = JSON.parse(body);
                    message.channel.send(bodyParsed.image);
                });
            });
        })();
    },
};