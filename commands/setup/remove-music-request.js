const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const Schema = require(`${process.cwd()}/structures/models/music-request`);

module.exports = {
    name: "remove-music-request",
    aliases: [],
    description: "",
    category: "setup",
    cooldown: 0,
    userPermissions: "ADMINISTRATOR",
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

            Schema.findOneAndDelete({
                Guild: message.guild.id
            }, async (err, data) => {
                if (!data) return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.x} Music Request System`)
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setDescription(`No __Music Request Channel__ Found`)
                    ]
                })

                message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.y} Music Request System`)
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setDescription(`**Music Request Channel** has been Removed!`)
                    ]
                });
            })
        } catch (e) {
            console.log(e)
        }
    }
};
