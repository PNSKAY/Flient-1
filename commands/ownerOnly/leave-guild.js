const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'leave-guild',
    aliases: ["leave-server"],
    usage: '',
    description: '',
    category: "ownerOnly",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: true,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee, prefix) {
        if (!args[0]) return message.reply({
            embeds: [new MessageEmbed()
                .setColor(ee.mediancolor)
                .setDescription(`${client.allEmojis.x} Please Mention The Server ID`)
            ]
        })

        let guild = client.guilds.cache.get(args[0]);
        if (!guild) return message.reply({
            embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${client.allEmojis.x} Please mention valid Server ID`)
            ]
        })

        let leaveGuild = await guild.leave()

        if (leaveGuild) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(`${client.allEmojis.y} Successfully left **${guild.name}** (${guild.id})`)
                ]
            })
        } else {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${client.allEmojis.x} I was unable to left the server`)
                ]
            })
        }
    }
}