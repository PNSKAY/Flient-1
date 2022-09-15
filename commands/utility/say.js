const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

var pattern = new RegExp(
  "^(https?:\\/\\/)?" +
  "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
  "((\\d{1,3}\\.){3}\\d{1,3}))" +
  "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
  "(\\?[;&a-z\\d%_.~+=-]*)?" +
  "(\\#[-a-z\\d_]*)?$",
  "i"
);

module.exports = {
  name: "say",
  aliases: [],
  usage: "say <input>",
  description: "Says your input via the bot",
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
      let Content = args.join(" ");
      if (!Content)
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`Please Give Me Something To Say!`)]});

      return message.channel.send({ content: `${Content}` });
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