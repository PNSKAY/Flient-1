const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const figlet = require("figlet");

module.exports = {
  name: "ascii",
  aliases: [],
  usage: "ascii <name>",
  description: "Create a ascii",
  category: "fun",
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
      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`${client.allEmojis.m} **Please provide some text**`)]});
      msg = args.join(" ");
      figlet.text(msg, function (err, data) {
        if (err) {
          console.log('Something went wrong');
          console.dir(err);
        }
        if (data.length > 2000) return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.wrongcolorcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} **Please provide text shorter than 2000 characters**`)]})
        message.reply('```' + data + '```');
      });
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