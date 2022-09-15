const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const ms = require("ms")

module.exports = {
  name: "timer",
  aliases: ['remind'],
  usage: '[time] [reason]',
  description: "Timer!",
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
      let = message.content.split(" ").slice(1)

      let time = args[0];
      if (!time) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`You didn't specify a time!\nusage: \`timer 60s/1m timer\``)]});

      let reason = args.slice(1).join(" ");
      if (!reason) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please put the reason`)]})

      message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`<a:badge1:946812395362328667> | Got it, I'll remind you after ${ms(ms(time))}`)]})

      setTimeout(function () {
        message.author.send({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`You asked me to remind you after ${ms(ms(time))}\nreason: ${reason}`)]});
        message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${message.author}, You asked me to remind you after ${ms(ms(time))}\nreason: ${reason}`)]})
      }, ms(time));
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