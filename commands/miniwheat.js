module.exports = {
	name: 'miniwheat',
	description: 'Flip a Mini-Wheat!',
	execute(message, args) {
		let outcomes = ["frosted", "plain"];
		let outcomesIndex = Math.round(Math.random());
		message.reply(`Your mini-wheat lands on the ${outcomes[outcomesIndex]} side!`);
	},
};