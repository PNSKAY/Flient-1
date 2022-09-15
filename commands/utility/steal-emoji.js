const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed,
  Util
} = require('discord.js');

module.exports = {
  name: "steal-emoji",
  aliases: ['steal-emojis', "add-emoji"],
  usage: "",
  description: "Steal Emojis from Other Servers.",
  category: "utility",
  cooldown: 0,
  userPermissions: "USE_EXTERNAL_EMOJIS",
  botPermissions: "USE_EXTERNAL_EMOJIS",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      if (!args.length) return message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please specify some emojis!`)]});
      for (const rawEmoji of args) {
        const parsedEmoji = Util.parseEmoji(rawEmoji);

        if (parsedEmoji.id) {
          const extension = parsedEmoji.animated ? ".gif" : ".png";
          const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
          message.guild.emojis.create(url, parsedEmoji.name).then((emoji) => message.channel.send({ embeds:[new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`Added: \`${emoji.url}\``)]})).catch((e) => {
              message.channel.send({ embeds: [new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`${client.allEmojis.x} Maximum Number of Animated Emojis Reached (50)`)]})
            })
        }
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
  },
};