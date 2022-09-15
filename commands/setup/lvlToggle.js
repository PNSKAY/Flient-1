const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const schema = require(`${process.cwd()}/structures/models/levelToggleSchema`);

module.exports = {
  name: 'level-toggle',
  aliases: ['lvl-t'],
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

  async execute(client, message, args, ee) {
    try {
      schema.findOne({
        guildId: message.guild.id
      }, async (e, data) => {
        if (!data) {
          new schema({
            guildId: message.guild.id,
            toggle: 1,
          }).save();
          return message.reply({ embeds:[new MessageEmbed()
            .setTitle(`${client.allEmojis.y} Leveling System`)
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`**Level Toggle** is now: **on**`)]});
        };

        if (data.toggle == 1) {
          data.toggle -= 1;
          data.save();
          return message.reply({ embeds:[new MessageEmbed()
            .setTitle(`${client.allEmojis.y} Leveling System`)
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`**Level Toggle** is now: **off**`)]});
        } else if (data.toggle == 0) {
          data.toggle += 1;
          data.save();
          return message.reply({ embeds:[new MessageEmbed()
            .setTitle(`${client.allEmojis.y} Leveling System`)
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`**Level Toggle** is now: **on**`)]});
        }
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