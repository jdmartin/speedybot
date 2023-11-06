const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll dice with optional modifier")
        .addStringOption(option =>
            option
                .setName("input")
                .setDescription("Specify dice rolls with an optional modifier (e.g., 2d6 + 2 or 2d6)")
                .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString("input");

        // Modify the regular expression to allow an optional modifier
        const regex = /^(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?$/i;
        const match = input.match(regex);

        if (!match) {
            return interaction.reply("Invalid input format. Please use the format `ndm (+/-) n`, e.g., `2d6 + 2` or `2d6`.");
        }

        const numDice = parseInt(match[1]);
        const numSides = parseInt(match[2]);
        const modifierOperator = match[3] || "+"; // Default to "+" if no modifier provided
        const modifierValue = parseInt(match[4]) || 0; // Default to 0 if no modifier provided

        // Roll the dice
        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * numSides) + 1;
            rolls.push(roll);
        }

        // Calculate the total
        let total = rolls.reduce((acc, roll) => acc + roll, 0);
        if (modifierOperator === '-') {
            total -= modifierValue;
        } else if (modifierOperator === '+') {
            total += modifierValue;
        }

        // Create the response message with detailed formatting
        const diceResults = rolls.map((roll, index) => `d${numSides}: ${roll}`);
        const modifierText = modifierValue !== 0 ? `Mod: ${modifierOperator} ${modifierValue}` : "";

        const responseMessage = `
${diceResults.join("\n")}
${modifierText}

Total: **${total}**
`;

        return interaction.reply(responseMessage);
    },
};
