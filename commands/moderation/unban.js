const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'unban',
  aliases: [],
  usage: "[ID] [reason]",
  description: 'Unban Member!',
  category: "moderation",
  cooldown: 0,
  userPermissions: "BAN_MEMBERS",
  botPermissions: "BAN_MEMBERS",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      let reason = args.slice(1).join(" ");
      let userID = args[0];

      if (!reason) reason = 'No reason given.';
      if (!args[0]) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`You must state someone to unban.`)
        ]
      });
      if (isNaN(args[0])) return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`The ID stated is not a number.`)
        ]
      });

      message.guild.bans.fetch().then(async bans => {
        if (bans.size == 0) return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`This server does not have anyone banned`)
          ]
        });
        let bUser = bans.find(b => b.user.id == userID);
        if (!bUser) return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`The user ID mentioned is not banned`)
          ]
        });
        await message.guild.members.unban(bUser.user, reason).catch(err => {
          console.log(err);
          return message.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`Something went wrong unbanning the id.`)
            ]
          });
        }).then(() => {
          message.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`Successfully Unbanned ${args[0]}`)
            ]
          });
        });
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
}