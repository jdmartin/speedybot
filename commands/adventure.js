module.exports = {
	name: 'adventure',
	cooldown: 10,
	description: 'Go on an Adventure!',
	execute(message, args) {
		message.reply(`This adventure, Speedy craves: https://quuxplusone.github.io/Advent/index.html`);
	},
};