const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

const axios = require("axios");

module.exports = {
  name: 'custom-avatar',
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
        
        let member = message.guild.members.cache.get(user.id);
        if (!member) await message.guild.members.fetch(user.id).catch(e => {}) || false;
        if (member) {
          const data = await axios.get(`https://discord.com/api/guilds/${message.guild.id}/members/${user.id}`, {
            headers: {
              Authorization: `Bot ${client.token}`
            }
          }).then(d => d.data);
          if (data.avatar && data.avatar != user.avatar) {
            let url = data.avatar.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
            url = `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${user.id}/avatars/${data.avatar}${url}`;
            message.channel.send({ embeds:[new MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`CUSTOM AVATAR OF ${user}`)
              .setImage(url)]})
          } else {
            message.channel.send({ embeds:[new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription('❌ User has no CUSTOM AVATAR')]})
          }
        } else {
          message.channel.send({ embeds:[new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`❌ **User has no CUSTOM AVATAR**`)]})
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