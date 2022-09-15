const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const autonickData = require(`${process.cwd()}/structures/models/autonick`)

module.exports = {
  name: 'remove-autonick',
  aliases: [],
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
      await autonickData.findOneAndDelete({
        guildId: message.guild.id,
      })
      return message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`${client.allEmojis.y} AutoNick System`)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Successfully Removed **Auto-Nick**.`)
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