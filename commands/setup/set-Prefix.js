const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'set-prefix',
  aliases: [],
  usage: '[prefix]',
  description: '',
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

      if (!args[0]) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.mediancolor)
          .setTitle(`${client.allEmojis.x} Please provide a new prefix!`)
        ]
      })

      if (args[1]) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.mediancolor)
          .setTitle(`${client.allEmojis.x} Please provide a new prefix!`)
        ]
      })

      if (args[0].length > 5) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(`${client.allEmojis.x} This prefix is too long, you have max 5 charaters`)
        ]
      })

      client.settings.set(message.guild.id, args[0], `prefix`)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.y} The Prefix has been set to \`${args[0]}\``)
        ]
      })

    } catch (e) {
      console.log(String(e.stack).bgRed)
      const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
      return errorLogsChannel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.guild.name, message.guild.iconURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.x} Got a Error:`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
          .setFooter(`Having: ${message.guild.memberCount} Users`)
        ]
      })
    }
  }
}