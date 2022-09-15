const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const axios = require("axios");

module.exports = {
  name: 'banner',
  aliases: [],
  usage: '',
  description: '',
  category: "utility",
  cooldown: 3,
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
      let user = message.mentions.users.first() || message.author;

        const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
          headers: {
            Authorization: `Bot ${client.token}`
          }
        }).then(d => d.data);
        if (data.banner) {
          let url = data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
          url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`;
          message.channel.send({ embeds:[new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`${client.allEmojis.y} **BANNER OF** ${user}`)
            .setFooter(ee.footertext, ee.footericon)
            .setImage(url)]})
        } else {
          message.channel.send({ embeds:[new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`${client.allEmojis.m} **User has no Banner**`)]})
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