const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const get = require('node-fetch2');

module.exports = {
  name: 'image',
  aliases: [],
  usage: '',
  description: 'Search images through google images',
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
      if (!args.length) return message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`${client.allEmojis.m} **Please specify the name of the image you want to search.**`)]})

      const cx = process.env.google_Engine_id || config.google_Engine_id;
      const key = process.env.google_API || config.google_API;

      let res = await get(
        `https://customsearch.googleapis.com/customsearch/v1?q=${args.join(' ')}&cx=${cx}&key=${key}&searchType=image`
      ).catch(e => console.log(e));

      if (!res) return message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`${client.allEmojis.m} **Unable to fetch the requested image.**`)]});
      if (res.status >= 400) return message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`${client.allEmojis.x} Error ${res.status}: ${res.statusText}`)]});

      res = await res.json();
      if (!res.items?.length) return message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`${client.allEmojis.m} **No results found.**`)]});

      message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setImage(res.items[0].link)
        .setTitle(`${args.join(' ')}`)
      ]});
    } catch (e) {
      console.log(e)
    }
  }
}