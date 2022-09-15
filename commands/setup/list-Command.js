const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const schema = require(`${process.cwd()}/structures/models/custom-commands`);

module.exports = {
  name: "list-command",
  aliases: [],
  usage: "",
  description: "",
  category: "setup",
  cooldown: 0,
  userPermissions: "ADMINISTRATOR",
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
      schema.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (!data) return message.channel.send({ embeds:[new MessageEmbed()
          .setTitle(`${client.allEmojis.x} Custom Command System`)
          .setColor(ee.wrongcolorcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription('There is no custom commands for this server!')]});
        const data2 = await schema.find({
          Guild: message.guild.id
        });
        message.channel.send({ embeds:[new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Custom Command System`)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(
            data2.map((cmd, i) =>
              `${i + 1}: ${cmd.Command} => ${cmd.Response}`
            ).join('\n')

          )
        ]})

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