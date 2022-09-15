const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const urban = require('relevant-urban');

module.exports = {
  name: "urbandictionary",
  aliases: ['urban'],
  usage: "[word]",
  description: "Give information about urban words!",
  category: "utility",
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
      if (!args[0])
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Please Enter Something To Search`)]});
      let image = "http://cdn.marketplaceimages.windowsphone.com/v8/images/5c942bfe-6c90-45b0-8cd7-1f2129c6e319?imageType=ws_icon_medium";
      try {
        let res = await urban(args.join(' '))
        if (!res) return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setDescription(`No results found for this topic, sorry!`)]});
        let {
          word,
          urbanURL,
          definition,
          example,
          thumbsUp,
          thumbsDown,
          author
        } = res;
        message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setAuthor(`Word - ${word}`)
          .setThumbnail(image)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`**Defintion:**\n*${definition || "No definition"}*\n\n**Example:**\n*${example || "No Example"}*`)
          .addField('**Rating:**', `**\`Upvotes: ${thumbsUp} | Downvotes: ${thumbsDown}\`**`)
          .addField("**Link**", `[link to ${word}](${urbanURL})`)
          .addField("**Author:**", `${author || "unknown"}`)
          .setTimestamp()]})
      } catch (e) {
        console.log(e)
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`looks like i've broken! Try again`)]})
      }
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