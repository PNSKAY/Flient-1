const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'gif',
  aliases: [],
  usage: '',
  description: 'Search for a gif!',
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
        .setFooter(ee.footertext, ee.footericon)
        .setColor(ee.mediancolor)
        .setDescription(`${client.allEmojis.m} **Please supply a search query!**`)]})
      const msg = args.join(" ")
      const res = fetch(`https://api.giphy.com/v1/gifs/search?q=${msg}&api_key=${process.env.giphy_API}&limit=1`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data.length <= 0) return message.reply({ embeds:[new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`${client.allEmojis.x} **No gifs found!**`)]})
          message.reply(`${json.data[0].url}`)
        })
    } catch (e) {
      console.log(e)
    }
  }
}