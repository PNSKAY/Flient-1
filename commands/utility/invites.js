const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "invites",
  aliases: [],
  usage: '',
  description: "",
  category: "utility",
  cooldown: 0,
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
      let user = message.mentions.users.first() || message.author
      let invites = await message.guild.invites.fetch();
      let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)

      if (userInv.size <= 0) {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${user} don't have any invites`)]})
      }

      let invCodes = userInv.map(x => x.code).join('\n')
      let i = 0;
      userInv.forEach(inv => i += inv.uses)

      message.reply({embeds: [new MessageEmbed()
        .setTitle(`${user.username} Invites`)
        .setDescription(`__**User Invites**__\n**${i}**\n__**Invite Codes**__\n\`${invCodes}\``)
        // .addField('User Invites', i)
        // .addField('Invite Codes', invCodes)
        .setColor(ee.color)
        .setTimestamp()]})
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