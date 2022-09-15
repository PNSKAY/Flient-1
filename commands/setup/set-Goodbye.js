const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const Schema = require(`${process.cwd()}/structures/models/goodbyeSchema`);

module.exports = {
  name: 'set-goodbye',
  aliases: ["set-leave"],
  usage: '',
  description: '',
  category: "setup",
  cooldown: 0,
  userPermissions: "ADMINISTRATOR",
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
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Goodbye System`)
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please mention a channel!`)]})
      Schema.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) {
          data.Channel = channel.id;
          data.save();
        } else {
          new Schema({
            Guild: message.guild.id,
            Channel: channel.id,
          }).save();
        }
        message.reply({ embeds:[new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Goodbye System`)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${channel} has been set as the **Goodbye Channel**`)]});
      })
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