const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const axios = require('axios')

module.exports = {
  name: "binary",
  aliases: [],
  usage: "",
  description: "",
  category: "fun",
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
      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`${client.allEmojis.m} **Please specify whether you want to \`encode\` or \`decode\`**`)]});

      const query = args.shift();
      let word = args.join(" ");

      if (query === 'encode') {
        if (!word) return message.reply({ embeds:[new MessageEmbed()
          .setFooter(ee.footertext, ee.footericon)
          .setColor(ee.mediancolor)
          .setDescription(`${client.allEmojis.m} **Please specify a word to encode**`)]});
        const {
          data
        } = await axios.get(`https://some-random-api.ml/binary?text=${encodeURIComponent(word)}`);

        message.reply({ embeds:[new MessageEmbed()
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`Encoded`)
          .setColor(ee.color)
          .setDescription(data.binary ?? 'Ann error occured', {
            code: "",
          })]})
      } else if (query === 'decode') {
        if (!word) return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.m} **Please specify a word to decode**`)]});
        const {
          data
        } = await axios.get(`https://some-random-api.ml/binary?decode=${encodeURIComponent(word)}`);

        message.reply({ embeds:[new MessageEmbed()
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`Decoded`)
          .setColor(ee.color)
          .setDescription(data.text ?? 'Ann error occured', {
            code: "",
          })]})
      } else return message.reply({ embeds:[new MessageEmbed()
        .setFooter(ee.footertext, ee.footericon)
        .setColor(ee.wrongcolor)
        .setDescription(`${client.allEmojis.m} **Please specify a valid option.**`)]});
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