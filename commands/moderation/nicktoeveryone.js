const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'nicktoeveryone',
  aliases: ["nicktoall"],
  usage: '',
  description: '',
  category: "moderation",
  cooldown: 0,
  userPermissions: "MANAGE_NICKNAMES",
  botPermissions: "MANAGE_NICKNAMES",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee, prefix) {
    try {
      if (!args[0]) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(`${client.allEmojis.x} Please supply a Nickname!\nIf you want to replace the username use \`{username}\`\n\nEg: \`${prefix}nicktoeveryone DECODERS {username}\``)
        ]
      });

      message.guild.members.cache.filter(m => !m.user.bot).forEach(r => r.setNickname(args.join(" ").replace(/{username}/g, `${r.user.username}`)))
      return message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Changing Nickname to Everyone`)
          .setDescription(`It might take a few \`mins\` or \`hours\` to change nick to everyone according to how many members u have!`)
          .setColor(ee.color)
          .setTimestamp()
        ]
      });
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