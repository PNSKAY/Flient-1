const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'change-name',
  aliases: ["changename"],
  usage: '',
  description: '',
  category: "ownerOnly",
  cooldown: 0,
  userPermissions: "",
  botPermissions: "",
  ownerOnly: true,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee, prefix) {
    if (!args[0])
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.m} You need to mention a new Bot Name`)
          .setDescription(`**Usage:** \`${prefix}change-name <New Bot Name>\``)
        ]
      });

    if (args.join(" ").length > 32)
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} Bot Name too long, can't have more then 32 Letters!`)
        ]
      });
    client.user.setUsername(args.join(" "))
      .then(user => {
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.y} Changed my Name to: \`${user.username}\``)
          ]
        });
      })
      .catch((e) => {
          console.log(e)
          return message.channel.send(`${e.message}`);
      });
  }
}