const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'giveaway-edit',
    usage: '',
    description: 'Edit a giveaway',
    category: "giveaway",
    cooldown: 0,
    userPermissions: "MANAGE_GUILD",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
        name: "message-id",
        description: "Provide the message id of the giveaway.",
        type: "STRING",
        required: true
    }, {
        name: "duration",
        description: "Provide a duraction for this giveaway (1m, 1h, 1d)",
        type: "STRING",
        required: true
    },
    {
        name: "winner",
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

                const messageId = options.getString("message-id");
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);
    
                if (!giveaway) {
                    errorEmbed.setDescription(`Unable to find the giveaway with the message id : ${messageId} in this guild.`);
                    return interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true
                    });
                }
                const duration = options.getString("duration");
                const newWinnerCount = options.getInteger("winners");
                const newPrize = options.getString("prize");
    
                client.giveawaysManager.edit(messageId, {
                    addTime: ms(duration),
                    newWinnerCount,
                    newPrize: `${client.allEmojis.giveaway.drop} ${newPrize} ${client.allEmojis.giveaway.drop}`,
                }).then(async () => {
                    successEmbed.setDescription("Giveaway was successfully updated")
                    return interaction.reply({
                        embeds: [successEmbed],
                        ephemeral: true
                    });
                }).catch((err) => {
                    errorEmbed.setDescription(`An Error has Occurred\n>>> ${err}`)
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