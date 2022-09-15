const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'removerolefromeveryone',
  aliases: ['removerolefromall'],
  usage: '',
  description: '',
  category: "moderation",
  cooldown: 0,
  userPermissions: "MANAGE_ROLES",
  botPermissions: "MANAGE_ROLES",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

      if (!role) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(`${client.allEmojis.x} Please mention a role to remove from everyone!`)
        ]
      });

      if (message.member.roles.highest.position <= role.position) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} You cannot remove this role from everyone as it is the same or above your current highest role.`)
        ]
      });
      if (message.guild.me.roles.highest.position <= role.position) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} I cannot remove this role from everyone as this role is the same or higher then mine.`)
        ]
      });

      message.guild.members.cache.filter(m => !m.user.bot).forEach(member => member.roles.remove(role))
      return message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Removing Role from Everyone`)
          .setDescription(`It might take a few \`mins\` or \`hours\` to remove role from everyone according to how many members u have!`)
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