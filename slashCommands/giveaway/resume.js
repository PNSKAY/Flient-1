const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'giveaway-resume',
    usage: '',
    description: 'Resume a giveaway',
    category: "giveaway",
    cooldown: 0,
    userPermissions: "MANAGE_GUILD",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    premium: true,
    options: [{
        name: "message-id",
        description: "Provide the message id of the giveaway.",
        type: "STRING",
        required: true
    }],

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

            client.giveawaysManager.unpause(messageId).then(() => {
                successEmbed.setDescription(`Giveaway has been Resumed`)
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                })
            }).catch((err) => {
                errorEmbed.setDescription(`An Error has Occurred\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            });
        } catch (err) {
            console.log(err)
        }
    }
}