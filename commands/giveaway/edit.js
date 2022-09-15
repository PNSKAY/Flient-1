const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: 'gedit',
    aliases: ["giveaway-edit"],
    usage: '',
    description: 'Edit a giveaway',
    category: "giveaway",
    cooldown: 0,
    userPermissions: "MANAGE_GUILD",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

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
            const duration = args[1];
            const newWinnerCount = args[2]
            const newPrize = args.slice(3).join(" ");

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
                    embeds: [errorEmbed],
                });
            }

            if (!duration) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.m} Giveaway System`)
                    .setColor(ee.mediancolor)
                    .setDescription()
                ]
            });

            if (isNaN(duration)) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`Number specified is not a valid number.`)
                ]
            });

            if (!winnerCount) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.m} Giveaway System`)
                    .setColor(ee.mediancolor)
                    .setDescription()
                ]
            });

            if (isNaN(winnerCount)) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`Number specified is not a valid number.`)
                ]
            });

            if (!prize) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.m} Giveaway System`)
                    .setColor(ee.mediancolor)
                    .setDescription()
                ]
            });

            client.giveawaysManager.edit(messageId, {
                addTime: ms(duration),
                newWinnerCount,
                newPrize: `${client.allEmojis.giveaway.drop} ${newPrize} ${client.allEmojis.giveaway.drop}`,
            }).then(async () => {
                successEmbed.setDescription("Giveaway was successfully updated")
                return message.reply({
                    embeds: [successEmbed]
                });
            }).catch((err) => {
                errorEmbed.setDescription(`An Error has Occurred\n>>> ${err}`)
                return message.reply({
                    embeds: [errorEmbed]
                });
            })
        } catch (err) {
            console.log(err)
        }
    }
}