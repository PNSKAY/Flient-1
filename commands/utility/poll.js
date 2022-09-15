const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'poll',
  aliases: [],
  usage: '',
  description: 'Start a simple poll in the server',
  category: "utility",
  cooldown: 0,
  userPermissions: "MANAGE_GUILD",
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
      if (!args[0])
        return message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`**Please Enter A Query!**`)]});

      var msg = await message.channel.send({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setAuthor(`${message.guild.name} | POLL`, message.guild.iconURL({ dynamic: true }))
        .setFooter(`By: ${message.member.displayName}`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(args.join(' '))]});

      await msg.react('👍');
      await msg.react('👎');
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