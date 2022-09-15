const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'nuke',
  aliases: [],
  usage: '',
  description: 'Nuke Channel!',
  category: "moderation",
  cooldown: 0,
  userPermissions: "MANAGE_CHANNELS",
  botPermissions: "MANAGE_CHANNELS",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      let reason = args.join(" ");
      const nukeChannel = message.channel;

      if (!reason) reason = "No reason given.";
      if (!nukeChannel.deletable) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`This channel is not deleteable.`)]});

      await nukeChannel.clone().catch(err => console.log(err));
      await nukeChannel.delete(reason).catch(err => console.log(err));
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