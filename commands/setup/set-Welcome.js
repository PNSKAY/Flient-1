const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const Schema = require(`${process.cwd()}/structures/models/welcomeSchema`);

module.exports = {
  name: 'set-welcome',
  aliases: [],
  usage: '',
  description: '',
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

  async execute(client, message, args, ee, prefix) {
    try {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Welcome System`)
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please mention a channel!`)]});

        const Welmsg = args.slice(1).join(" ");
        if(!Welmsg) return message.reply({ embeds:[new MessageEmbed()
        .setTitle(`${client.allEmojis.m} Welcome System`)
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`Please mention a custom welcome message!\nIf you want to mention the member use \`<@>\`\n If you want mention server name use \`<server>\`\nIf you want mention the member count use \`<count>\`\n\nEg: \`${prefix}set-welcomechannel #channel Welcome <@>, to **<server>**, Now we have **<count> Members**\``)]});

      Schema.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) {
          data.Channel = channel.id,
          data.WelcomeMsg = Welmsg;
          data.save();
        } else {
          new Schema({
            Guild: message.guild.id,
            Channel: channel.id,
            WelcomeMsg: Welmsg,
          }).save();
        }
        message.reply({ embeds:[new MessageEmbed()
          .setTitle(`${client.allEmojis.y} Welcome System`)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${channel} has been set as the **Welcome Channel**\n**Welcome Message** is \`${Welmsg}\``)]});
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