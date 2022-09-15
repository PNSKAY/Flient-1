const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "coinflip",
  aliases: ['coin', 'flip'],
  usage: 'coinflip',
  description: 'flips a coin',
  category: "fun",
  cooldown: 5,
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
      const n = Math.floor(Math.random() * 2);
      let result;
      if (n === 1) result = 'Heads';
      else result = 'Tails';
      message.reply({ embeds:[new MessageEmbed()
        .setFooter(ee.footertext, ee.footericon)
        .setColor(ee.color)
        .setDescription(`${client.allEmojis.y} **${message.member.displayName} Flipped ${result}**!`)]});
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
};