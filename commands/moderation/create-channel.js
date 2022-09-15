const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'create-channel',
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
      const channelNameQuery = args.join(" ");
      if (!channelNameQuery) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`PLease specify a name for the channel!`)]})

      message.guild.channels.create(channelNameQuery).then((ch) => {
        message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Channel has been successfully created ${ch}`)]})
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