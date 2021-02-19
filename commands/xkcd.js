module.exports = {
    name: 'xkcd',
    description: 'Get a random xkcd comic!',
    execute(message, args) {
        const fetch = require('node-fetch');

        (async function () {
            const {
                num
            } = await fetch('https://xkcd.com/info.0.json').then(response => response.json());

            const choice = Math.round(Math.random() * (num - 1) + 1);
            
            const {
                img
            } = await fetch(`https://xkcd.com/${choice}/info.0.json`).then(response => response.json());
            
            const Discord = require("discord.js");
            const embed = new Discord.MessageEmbed()
            .setTitle("xkcd")
            .addFields(`{name: "Link to Original", value: "https://xkcd.com/${choice}/"}`)
            .setImage(img)
            
            
            if (message.channel.type === 'dm') {
                message.reply(`Here you go:\n\n(If you don't see anything, try !speedyhelp.)`);
                message.channel.send(embed);
            } else {
                message.member.send(`Here you go:\n\n(If you don't see anything, try !speedyhelp.)`);
                message.member.send(embed);
            }
        })();
    },
};