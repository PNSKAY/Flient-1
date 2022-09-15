const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "suggest",
  aliases: ['suggestion'],
  usage: '',
  description: "bot suggest command",
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
        .setDescription(`Please specify a suggestion for bot!`)]})

      message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`✉ | ${message.author.username}, Thanks for the suggestion! :)`)]})

      const suggestionChannel = client.channels.cache.get(config.botlogs.suggestionChannel)
      if (!suggestionChannel) return;

      suggestionChannel.send({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`__New Suggestion:__`)
        .setDescription(`**Author:**\n> ${message.author.username} | (${message.author.id})\n**Suggestion:**\n> ${msg}`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter(`Suggested From: ${message.guild.name} | (${message.guild.id})`, message.guild.iconURL({
          dynamic: true
        }))]}).then(sendMessage => sendMessage.react(client.allEmojis.y)).then(reaction => reaction.message.react(client.allEmojis.x))
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