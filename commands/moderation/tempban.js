const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'tempban',
  aliases: [],
  usage: "[@member] [time] [reason]",
  description: 'Tempban Member!',
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
      const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      let time = args[1];
      let reason = args.slice(2).join(" ");

      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You must mention a member to tempban with a duraction of time.`)]});
      if (!mentionedMember) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`The member stated is not in the server.`)]});
      if (!mentionedMember.bannable) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`This member is not bannable.`)]});
      if (mentionedMember.roles.highest.postion >= message.member.roles.highest.postion) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You cannot tempban this member as their role is the same or higher then yours.`)]});
      if (!time) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You must state a duraction of time.`)]});
      if (!reason) reason = 'No reason given.';

      await mentionedMember.send({ embeds:[new MessageEmbed()
        .setTitle(`You have been banned in ${message.guild.name}`)
        .addField(`Reason: ${reason}`, `Duration ${time}`)
        .setFooter(ee.footertext, ee.footericon)
        .setColor(ee.wrongcolor)
        .setTimestamp()]}).catch(err => console.log('I was unable to message the member.'));
      await mentionedMember.ban({
        days: 7,
        reason: reason
      }).catch(err => console.error(err));

      setTimeout(async function () {
        await message.guild.bans.fetch().then(async bans => {
          if (bans.size == 0) return message.channel.send({ embeds:[new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`This guild does not have any bans.`)]});
          let bannedUser = bans.find(b => b.user.id == mentionedMember.id);
          if (!bannedUser) return console.log('Member unbanned');
          await message.guild.members.unban(bannedUser.user, reason).catch(err => console.log(err));
          await mentionedMember.send({ embeds:[new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`Your ban has been lifted in ${message.guild.name}.`)]}).catch(err => console.log('I was unable to message the member.'));
        })
      }, ms(time));
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