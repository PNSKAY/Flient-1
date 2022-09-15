const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'slowmode',
  aliases: [],
  usage: "[seconds]",
  description: 'Sets SlowMode for Channels',
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
      if (!args[0]) {
        message.channel.setRateLimitPerUser(0);
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`You need to mention a number in which how long you would like the slowmode to be set to.`)]})
      }
      const raw = args[0];
      const milliseconds = ms(raw)
      if (isNaN(milliseconds)) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`This is not a valid time!`)]});
      if (milliseconds < 1000) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`The minimum slowmode is 1 seconds`)]});
      if (milliseconds > 21600000) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`The maximum slowmode is 21600 seconds`)]});
      message.channel.setRateLimitPerUser(milliseconds / 1000);
      message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${client.allEmojis.y} The slowmode for this channel has been set to ${ms(milliseconds, {
      long: true
    })}`)]})
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