const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'kick',
  aliases: [],
  usage: "[@user] [reason]",
  description: 'Kick Member!',
  category: "moderation",
  cooldown: 0,
  userPermissions: "KICK_MEMBERS",
  botPermissions: "KICK_MEMBERS",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      const mentionedMember = message.mentions.members.first();
      let reason = args.slice(1).join(" ");
      if (!reason) reason = "No reason given";

      // `${prefix}kick @user reason`
      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You need to state a user to kick!`)]});
      if (!mentionedMember) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`The member mentioned is not in the server!`)]});
        
        if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} You cannot kick this user as his role is same role of your's or above your current highest role.`)
        ]
      });
        
      if (message.guild.me.roles.highest.position <= mentionedMember.roles.highest.position) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} I cannot kick this user as his role is the same or higher then mine.`)
        ]
      });
        
      try {
        await mentionedMember.send({ embeds:[new MessageEmbed()
          .setTitle(`You were kicked from ${message.guild.name}`)
          .setDescription(`Reason: ${reason}`)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setFooter(client.user.tag, client.user.displayAvatarURL())]});
      } catch (err) {
        console.log('I was unable to message the member.');
      }

      try {
        await mentionedMember.kick(reason);
      } catch (err) {
        console.log(err)
        return message.reply({ embeds:[new MessageEmbed()
          .setDescription(`I was unable to kick the member mentioned.`)
          .setFooter(ee.footertext, ee.footericon)
          .setColor(ee.color)]})
      }
      message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Successfully Kicked the member!`)]});
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