const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const db = require(`${process.cwd()}/structures/models/warningSchema`);

module.exports = {
  name: 'warn',
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
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if (!user) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription('Please mention the member you want to warn.')]})
      const reason = args.slice(1).join(" ")
      if (!reason) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription('Please mention a reason for the warning.')]})
      db.findOne({
        guildid: message.guild.id,
        user: user.user.id
      }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new db({
            guildid: message.guild.id,
            user: user.user.id,
            content: [{
              moderator: message.author.id,
              reason: reason
            }]
          })
        } else {
          const obj = {
            moderator: message.author.id,
            reason: reason
          }
          data.content.push(obj)
        }
        data.save()
      });
      message.reply({ embeds:[new MessageEmbed()
        .setDescription(`Warned ${user} for ${reason}`)
        .setFooter(ee.footertext, ee.footericon)
        .setColor(ee.color)]})
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