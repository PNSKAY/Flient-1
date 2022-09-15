const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'meme',
  aliases: [],
  usage: 'memes',
  description: 'Get some cool memes :)',
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
      const url = 'https://some-random-api.ml/meme';

    let data, response;
    try {
      response = await axios.get(url);
      data = response.data;
    } catch (e) {
      return message.channel.send({ embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setTitle(`${client.allEmojis.x} **An error has occured, try again!**`)]})
    }

      await message.reply({ embeds:[new MessageEmbed()
      .setTitle(`${client.allEmojis.y} Random Meme:`)
      .setDescription(data.caption)
      .setColor(ee.color)
      .setImage(data.image)]});
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
};