const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: 'giveaway-start',
    usage: '',
    description: 'Start a giveaway',
    category: "giveaway",
    cooldown: 0,
    userPermissions: "MANAGE_GUILD",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
            name: "duration",
            description: "Provide a duraction for this giveaway (1m, 1h, 1d)",
            type: "STRING",
            required: true
        },
        {
            name: "winners",
            description: "Select the amount of winners for this giveaway",
            type: "INTEGER",
            required: true
        },
        {
            name: "prize",
            description: "Provide a name of the prize",
            type: "STRING",
            required: true
        },
        {
            name: "channel",
            description: "Select a channel to send the giveaway to.",
            type: "CHANNEL",
            //channelTypes: ["GUILD_TEXT"],
            required: false
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        try {
            const {
                options
            } = interaction;

            const errorEmbed = new MessageEmbed()
                .setColor("#FFD700")

            const successEmbed = new MessageEmbed()
                .setColor("#FFD700")

            const gchannel = options.getChannel("channel") || interaction.channel;
            const duration = options.getString("duration");
            const winnerCount = options.getInteger("winners");
            const prize = options.getString("prize");

            client.giveawaysManager.start(gchannel, {
                duration: ms(duration),
                winnerCount,
                prize: `${client.allEmojis.giveaway.drop} ${prize} ${client.allEmojis.giveaway.drop}`,
                hostedBy: interaction.user || null,
                thumbnail: interaction.guild.iconURL({
                    dynamic: true
                }) || null,
                messages: {
                    giveaway: `>>> ${client.allEmojis.giveaway.react} **GIVEAWAY STARTED** ${client.allEmojis.giveaway.react}`,
                    giveawayEnded: `>>> ${client.allEmojis.giveaway.react} **GIVEAWAY ENDED** ${client.allEmojis.giveaway.react}`,
                    drawing: `Ends: {timestamp}`,
                    // timeRemaining: "Time remaining: **{duration}**!",
                    dropMessage: `Be the first to react with ${client.allEmojis.giveaway.react} !`,
                    inviteToParticipate: `>>>   React with ${client.allEmojis.giveaway.react} to participate!`,
                    winMessage: `${client.allEmojis.giveaway.react} **Congrats** {winners}!\n> You won **{this.prize}**\n> **Jump:** {this.messageURL}\nHosted by: {this.hostedBy}`,
                    embedFooter: '{this.winnerCount} winner(s)',
                    noWinner: `>>> Giveaway cancelled, No valid participations. :cry:`,
                    hostedBy: `Hosted By: {this.hostedBy}`,
                    winners: 'Winner(s):',
                    endedAt: 'Ended at',
                },
                lastChance: {
                    enabled: true,
                    content: '⚠️ **LAST CHANCE TO ENTER!** ⚠️',
                    threshold: 5000,
                    embedColor: '#FF0000'
                }
            }).then(async () => {
                successEmbed.setDescription("Giveaway was successfully started")
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                });
            }).catch((err) => {
                successEmbed.setDescription(`An Error has Occurred\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            })
        } catch (err) {
            console.log(err)
        }
    }
}