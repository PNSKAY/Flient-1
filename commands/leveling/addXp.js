const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const Levels = require('discord-xp');

module.exports = {
  name: 'add-xp',
  aliases: [],
  usage: '',
  description: '',
  category: "leveling",
  cooldown: 0,
  userPermissions: "MANAGE_GUILD",
  botPermissions: "",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    const mentionmember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!mentionmember) return message.reply({
      embeds: [new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Please mentions the member to add Xp`)
        .setColor(ee.mediancolor)
      ]
    });
    const value = Number(args[1]);
    const levelUser = await Levels.fetch(mentionmember.user.id, message.guild.id);
    if (!value) return message.reply({
      embeds: [new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Please mention the amount of Xp you want to add to`)
        .setColor(ee.mediancolor)
      ]
    });
    try {
      await Levels.appendXp(mentionmember.user.id, message.guild.id, value);
      message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Added: **${value}** Xp to **${mentionmember.user.tag}**`)
          .setColor(ee.color)
        ]
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