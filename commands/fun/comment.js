const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment
} = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
  name: 'comment',
  aliases: [],
  usage: '<text>',
  description: 'Shows your text as a Youtube Comment',
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
      const comment = args.join('');
      if (!comment) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.m} **Provide something to Comment!**`)
        ]
      })
      try {
        let yt = await canvacord.Canvas.youtube({
          "avatar": message.author.displayAvatarURL({
            format: "png"
          }),
          "username": message.author.username,
          "content": args.join(" ")
        })
        let attachment = new MessageAttachment(yt, 'comment.png')
        message.reply({
          files: [attachment]
        });
      } catch (err) {
        message.reply({
          embeds: [new MessageEmbed()
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Something went wrong.**\n**Note : It won't work if the User contains Unwanted characters in his Username.**`)
            .setColor(ee.wrongcolor)
          ]
        });
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
  }
};