const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const db = require(`${process.cwd()}/structures/models/warningSchema`);

module.exports = {
  name: 'remove-warn',
  aliases: [],
  usage: "",
  description: '',
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
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!user) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription('Please mention a member to remove the warns.')]})
      db.findOne({
        guildid: message.guild.id,
        user: user.user.id
      }, async (err, data) => {
        if (err) throw err;
        if (data) {
          let number = parseInt(args[1]) - 1
          data.content.splice(number, 1)
          message.reply({ embeds:[new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription('Successfully Removed 1 Warning for the user.')]})
          data.save()
        } else {
          message.reply({ embeds:[new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription('This user does not have any warnings in this server!')]})
        }
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