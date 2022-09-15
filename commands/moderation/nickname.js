const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'nickname',
  aliases: [],
  usage: "[@member] [nickname]",
  description: 'Change Nickname!',
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

  async execute(client, message, args, ee) {
    try {
      const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      const nickName = args.slice(1).join(" ");

      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You must mention a member to change a nickname.`)]});
      if (!mentionedMember) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`The member mentioned is not in the server.`)]});
      if (!nickName) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please mention a nickname for the member.`)]});
      if (!mentionedMember.kickable) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`I cannot change that members nickname as their roles is higher then mine.`)]});

      await mentionedMember.setNickname(nickName).catch(err => console.log(err).then(message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Hey I cannot add that nickname due to an error!`)]})));
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