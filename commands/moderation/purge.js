const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'purge',
  aliases: ['clear', 'delete'],
  usage: "[number]",
  description: 'Purge Messages!',
  category: "moderation",
  cooldown: 0,
  userPermissions: "MANAGE_MESSAGES",
  botPermissions: "MANAGE_MESSAGES",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      const member = message.mentions.members.first();
      const messages = message.channel.messages.fetch();

      if (member) {
        const userMessages = (await messages).filter((m) => m.author.id === member.id);
        await message.channel.bulkDelete(userMessages);
        message.channel.send({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${member} messages has been cleared.`)]})
      } else {
        if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Please specify a number of messages to purge.`)]});
        if (isNaN(args[0])) return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Number specified is not a valid number.`)]});
        if (!parseInt(args[0]) || parseInt(args[0]) < 1 || parseInt(args[0]) > 99) return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`The number specified must be between 1 and 99.`)]});
        await message.channel.bulkDelete(parseInt(args[0])).then(messages => message.channel.send({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`**Succesfully deleted \`${messages.size}/${args[0]}\` messages.**`)]}).then(msg => setTimeout(() => msg.delete(), 3000))).catch(() => null)
        //   .setDescription(`**Succesfully deleted \`${messages.size}/${args[0]}\` messages.**`)]}).then(msg => msg.delete({
        //   timeout: 3000
        // }))).catch(() => null)
      }
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
  },
};