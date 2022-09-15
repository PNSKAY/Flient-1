const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const Schema = require(`${process.cwd()}/structures/models/goodbyeSchema`);

module.exports = {
  name: 'remove-goodbye',
  aliases: ["remove-leave"],
  usage: '',
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
      Schema.findOneAndDelete({
        Guild: message.guild.id
      }, async (err, data) => {
        if (!data) return message.reply({
          embeds: [new MessageEmbed()
            .setTitle(`${client.allEmojis.x} Goodbye System`)
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`No Goodbye Channel`)
          ]
        })
        message.reply({
          embeds: [new MessageEmbed()
            .setTitle(`${client.allEmojis.y} Goodbye System`)
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`**Goodbye Channel** has successfully Removed`)
          ]
        });
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