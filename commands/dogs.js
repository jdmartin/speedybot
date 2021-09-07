module.exports = {
    name: 'dogs',
    description: 'See a random dog!',
    aliases: ['dog'],
    usage: '[optional dog breed]',
    notes: 'These are the breeds you can use: cardigan, corgi, germanshepherd, husky, pembroke, and poodle.\nDogs courtesy of https://dog.ceo/dog-api/',
    execute(ds_message, args) {
        const https = require("https");
        const dogsDict = {
            corgi: 'corgi',
            cardigan: 'corgi/cardigan',
            pembroke: 'pembroke',
            poodle: 'poodle/standard',
            husky: 'husky',
            germanshepherd: 'germanshepherd'
        };

        if (!args.length) {
            (async function () {
                https.get('https://dog.ceo/api/breeds/image/random', res => {
                    res.setEncoding("utf8");
                    let body = '';
                    res.on("data", data => {
                        body += data;
                    });
                    res.on("end", () => {
                        var bodyParsed = JSON.parse(body);
                        let message = bodyParsed.message;
                        ds_message.channel.send(message);
                    });
                })
            })();
        } else if (args[0] in (dogsDict)) {
            (async function () {
                const breed = dogsDict[args[0]];
                https.get(`https://dog.ceo/api/breed/${breed}/images/random`, res => {
                    res.setEncoding("utf8");
                    let body = '';
                    res.on("data", data => {
                        body += data;
                    });
                    res.on("end", () => {
                        var bodyParsed = JSON.parse(body);
                        let message = bodyParsed.message;
                        ds_message.channel.send(message);
                    });
                })
            })();
        } else {
            ds_message.reply("Sorry, I don't understand. Try `!dogs` for a random dog, `!dogs corgi` for a corgi, `!dogs cardigan` for a cardigan corgi, `!dogs pembroke` for a Pembroke corgi, `!dogs poodle` for a poodle, `!dogs germanshepherd` for a german shepherd, or `!dogs husky` for a husky.")
        }
    },
};