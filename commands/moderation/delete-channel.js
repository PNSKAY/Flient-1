const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'delete-channel',
  aliases: [],
  usage: '',
  description: '',
  category: "moderation",
  cooldown: 0,
  userPermissions: "MANAGE_CHANNELS",
  botPermissions: "MANAGE_CHANNELS",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      const channelTarget = message.mentions.channels.first()
      if (!channelTarget) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please specify a channel to delete.`)]})
      channelTarget.delete().then(async (ch) => {
        await message.author.send({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Channel has been successfully deleted.`)]}).catch(err => console.log('I was unable to message the member.'));
      });
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
  },
};