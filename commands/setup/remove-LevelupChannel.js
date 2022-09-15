const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'remove-levelupchannel',
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
      const data = client.settings.get(message.guild.id, "levelupChannel");

        if (!data) return message.reply({ embeds:[new MessageEmbed()
          .setTitle(`${client.allEmojis.x} Levelup System`)
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`No Levelup Channel`)]})
        
        client.settings.delete(message.guild.id, "levelupChannel");
        message.reply({ embeds:[new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Levelup System`)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`**Levelup Channel** has successfully Removed`)]});
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