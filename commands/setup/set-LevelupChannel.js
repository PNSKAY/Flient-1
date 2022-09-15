const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'set-levelupchannel',
  aliases: [],
  usage: '',
  description: '',
  category: "setup",
  cooldown: 0,
  userPermissions: "ADMINISTRATOR",
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
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Levelup System`)
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please mention a channel!`)]});

        client.settings.set(message.guild.id, channel.id, "levelupChannel")
        
        message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setTitle(`${client.allEmojis.y} Levelup System`)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${channel} has been set as the Levelup Channel`)]});
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