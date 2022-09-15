const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "report-bug",
  aliases: ["bug"],
  usage: '',
  description: "bug command",
  category: "report",
  cooldown: 0,
  userPermissions: "",
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
      const msg = args.join(" ")
      if (!msg) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please specify the bug!`)]})

      message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`✉ | ${message.author.username}, Thanks for finding the bug!`)]})

      const bugChannel = client.channels.cache.get(config.botlogs.bugChannel)
      if (!bugChannel) return;

      bugChannel.send({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(`__New Bug:__`)
        .setDescription(`**Author:**\n> ${message.author.username} | (${message.author.id})\n**Report:**\n> ${msg}`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter(`Bug From: ${message.guild.name} | (${message.guild.id})`, message.guild.iconURL({
          dynamic: true
        }))]})
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