const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const Levels = require('discord-xp');

module.exports = {
  name: 'reset-level',
  aliases: ["resetlevel"],
  usage: '',
  description: '',
  category: "leveling",
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
    const mentionmember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!mentionmember) return message.reply({ embeds: [new MessageEmbed()
    .setTitle(`${client.allEmojis.m} Please mentions the member to deleted the leveling data`)
    .setColor(ee.mediancolor)] });
    try {
      await Levels.deleteUser(mentionmember.user.id, message.guild.id);
      message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Successfully Deleted Leveling Database For: \`${mentionmember.user.tag}\``)
          .setColor(ee.color)]
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
