const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: 'gresume',
    aliases: ["giveaway-resume"],
    usage: '',
    description: 'Resume a giveaway',
    category: "giveaway",
    cooldown: 0,
    userPermissions: "MANAGE_GUILD",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    premium: true,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee) {
        try {
            const errorEmbed = new MessageEmbed()
                .setColor(ee.wrongcolor)

            const successEmbed = new MessageEmbed()
                .setColor(ee.color)

            const messageId = args[0];

            if (!messageId) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.m} Giveaway System`)
                    .setColor(ee.mediancolor)
                    .setDescription()
                ]
            });

            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`Unable to find the giveaway with the message id : ${messageId} in this guild.`);
                return message.reply({
                    embeds: [errorEmbed]
                });
            }

            client.giveawaysManager.unpause(messageId).then(() => {
                successEmbed.setDescription(`Giveaway has been Resumed`)
                return message.reply({
                    embeds: [successEmbed]
                })
            }).catch((err) => {
                errorEmbed.setDescription(`An Error has Occurred\n>>> ${err}`)
                return message.reply({
                    embeds: [errorEmbed]
                });
            });
        } catch (err) {
            console.log(err)
        }
    }
}