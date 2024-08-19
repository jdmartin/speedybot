const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("info").setDescription("Answers to all your burning questions...")
        .addSubcommand(subcommand =>
            subcommand
                .setName('addons')
                .setDescription('How do I know what addons are required for raiding?'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('attendance')
                .setDescription('How do I post (or delete) an absence?'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('corkboard')
                .setDescription('How do I check the Corkboard?'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('crafter')
                .setDescription('How do I find a raid crafter?')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('How do I check the logs?')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('loot')
                .setDescription('How do I know what to roll for loot?')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('schedule')
                .setDescription('How do I find the raid schedule?')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('signup')
                .setDescription('How do I sign up to raid?')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('trb')
                .setDescription('How do I join the TRB channel in game?')
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'addons':
                addonsEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I know what addons are required for raiding?")
                    .addFields({
                        name: " ",
                        value: "\nThere are no addons that are absolutely required for raiding, but I strongly recommend that you have the following two installed and updated:\n\n- RC LootCouncil: [(link)](https://www.curseforge.com/wow/addons/rclootcouncil) Without this, you need to keep track of your own loot\n- DBM [(link)](https://www.curseforge.com/wow/addons/deadly-boss-mods) or BigWigs [(link)](https://www.curseforge.com/wow/addons/big-wigs) Without these, you need to keep track of your own feet\n\n**As a note**: Speedy keeps an eye on all the popular add-ons and watches for when they update. If you want an easy way to check everything before raid to make sure you’re current, check in the Speedy chat! He’s got your back.",
                        inline: true
                    })

                interaction.reply({ embeds: [addonsEmbed], ephemeral: true });
                break;
            case 'attendance':
                absenceEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I post (or delete) an absence?")
                    .addFields({
                        name: " ",
                        value: "\n**To update your attendance through Discord:**\n- Make sure you aren’t in a private message window. Any public channel will work, even this one!\n- Just type `/attendance` in the typing box, and Speedy will pop up a box for you to enter your information in!\n- The box and its contents do not appear as a chat post, all anyone else will see is the end result, such as “Alien will be absent tomorrow because he sent Evie Frosted claws in the mail\n\n**To update your attendance through the Corkboard:**\n- Go to the Corkboard [(link)](https://velocitycorkboard.com)\n- Fill out the form with your info (the big box on the left to add an absence, the small box on the right to cancel one)\n- Copy down the secret code at the bottom in case you need to change your answer later.",
                        inline: true
                    })

                interaction.reply({ embeds: [absenceEmbed], ephemeral: true });
                break;
            case 'corkboard':
                corkEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I check the Corkboard?")
                    .addFields({
                        name: " ",
                        value: "\nYou can get to the Corkboard Here [(link)](https://velocitycorkboard.com).\n\nIf you need the password:\n- Make sure you aren’t in a private message window. Any public channel will work, even this one!\n- Just type `/corkboard` in the typing box. Speedy will give you a link and the code, and no one will be able to see that you've asked!",
                        inline: true
                    })

                interaction.reply({ embeds: [corkEmbed], ephemeral: true });
                break;
            case 'crafter':
                craftEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I find a raid crafter?")
                    .addFields({
                        name: " ",
                        value: "\nThe master list of crafters is on a spreadsheet in the Corkboard! [(link)](https://velocitycorkboard.com).\n\nIf you need to find someone in charge of a profession, that’s where you look. If you want to _BE_ in charge of a profession, message @Evie!",
                        inline: true
                    })

                interaction.reply({ embeds: [craftEmbed], ephemeral: true });
                break;
            case 'logs':
                logsEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I check the logs?")
                    .addFields({
                        name: " ",
                        value: "\nDoolan keeps all the logs for the raid here [(link)](https://www.warcraftlogs.com/guild/reports-list/41907/).\n\nYou can also access them by typing `/logs` into any public chat channel, and it will post a link for all to see!",
                        inline: true
                    })

                interaction.reply({ embeds: [logsEmbed], ephemeral: true });
                break;
            case 'loot':
                lootEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I know what to roll for loot?")
                    .addFields({
                        name: " ",
                        value: "\n**Regular items** all use the following system:\n- Major upgrade: Something you consider best in slot\n- Minor Upgrade: All normal gear upgrades\n- Off-spec: You will rarely use this item\n- Transmog: Anything you want for transmog, for yourself or an alt\n- Pass: This item is more valuable as a shard\n\n**Tier tokens** have their own separate loot rolls!\n- 4-piece Bonus: Only for the very last armor piece you need to complete your tier set\n- Upgrade: All normal tier upgrades, normal or heroic\n- Pass: You don’t want nasty old tier anyway\n\n**Crafting recipes** have their own separate loot rolls too!\n- Raidcrafter: Official use only\n- Profession: Any recipe your current character could use\n- Alt: You can’t use it, but your alt can\n- Pass: You literally can’t read it. Are those even words?\n\nFor more information on how and why the loot system works, see the Corkboard! [(link)](https://velocitycorkboard.com)",
                        inline: true
                    })

                interaction.reply({ embeds: [lootEmbed], ephemeral: true });
                break;
            case 'schedule':
                schedEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I check the raid schedule?")
                    .addFields({
                        name: " ",
                        value: "\nThe raid schedule is always the same during an active Tier:\n- Tuesday, Thursday, Sunday\n- Invites at 8:15\n- Raid 8:30-10:30 (Server time)\n\nDuring breaks, or when there are special circumstances, I will post the schedule each week (as soon as I know it) out in the Announcements section.\n\nThere is also a calendar on the Corkboard! [(link)](https://velocitycorkboard.com)",
                        inline: true
                    })

                interaction.reply({ embeds: [schedEmbed], ephemeral: true });
                break;
            case 'signup':
                signupEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I sign up to raid?")
                    .addFields({
                        name: " ",
                        value: "\nRaid signups are handled on the Corkboard through a spreadsheet. You can find it here in the Extras section [(link)](https://velocitycorkboard.com).\n\nNeed the password?  Type `/corkboard` in any public channel. You're the only one that will see the response!",
                        inline: true
                    })

                interaction.reply({ embeds: [signupEmbed], ephemeral: true });
                break;
            case 'trb':
                trbEmbed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle("How do I join the TRB community channel in game?")
                    .addFields({
                        name: " ",
                        value: `\nIf you have a new alt and you want to get into the community channel:\n- Open up the Community settings thing in game and select “Join a community”.\n- When prompted for a code, paste in: ${process.env.raidbrigcode}\n\nYou can also access this by typing /raidbrigade into any public channel. Only you will see the result!`,
                        inline: true
                    })

                interaction.reply({ embeds: [trbEmbed], ephemeral: true });
                break;
        }
    },
};
