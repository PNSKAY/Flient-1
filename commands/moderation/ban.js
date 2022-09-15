const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'ban',
  aliases: [],
  usage: "[@user] [reason]",
  description: 'Ban Member!',
  category: "moderation",
  cooldown: 0,
  userPermissions: "BAN_MEMBERS",
  botPermissions: "BAN_MEMBERS",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
        
      let reason = args.slice(1).join(" ");
      const mentionedMember = message.mentions.members.first();
        
        
      if (!reason) reason = 'No reason given.';
      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You must state someone to ban.`)]});
        
      if (!mentionedMember) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`The member mentioned is not in the server.`)]});
        
        if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} You cannot ban this user as his role is same role of your's or above your current highest role.`)
        ]
      });
        
      if (message.guild.me.roles.highest.position <= mentionedMember.roles.highest.position) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} I cannot ban this user as his role is the same or higher then mine.`)
        ]
      });
        
      if (!mentionedMember.bannable) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`I cannot ban that member.`)]});

      await mentionedMember.send({ embeds:[new MessageEmbed()
        .setTitle(`You have been banned from ${message.guild.name}`)
        .setDescription(`Reason for being banned: ${reason}`)
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()]}).catch(err => console.log('I was unable to message the member.'));
      await mentionedMember.ban({
        reason: reason
      }).catch(err => console.log(err)).then(() => message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription("Successfully banned " + mentionedMember.user.tag)]}));
        
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