module.exports = {
	name: 'adventure',
	description: 'Go on an Adventure!',
	usage: '',
	notes: '',
	execute(message) {
		message.channel.send(`This adventure, Speedy craves: https://quuxplusone.github.io/Advent/index.html`);
	},
};