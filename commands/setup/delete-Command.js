const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const schema = require(`${process.cwd()}/structures/models/custom-commands`);

module.exports = {
  name: 'delete-command',
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
      const name = args[0];

      if (!name) return message.channel.send({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Custom Command System`)
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription('Please specify a command name')]});

      const data = await schema.findOne({
        Guild: message.guild.id,
        Command: name
      });
      if (!data) return message.channel.send({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.x} Custom Command System`)
        .setColor(ee.wrongcolorcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription('That custom command does not exist!')]});
      await schema.findOneAndDelete({
        Guild: message.guild.id,
        Command: name
      });
      message.channel.send({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.y} Custom Command System`)
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Successfully Removed **${name}** from **Custom Commands**.`)]});
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