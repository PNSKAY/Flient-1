const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: [],
  usage: '@member',
  description: 'Shows the user avatar!',
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
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(' ') || x.user.username === args[0]) || message.member;
      message.reply({ embeds:[new MessageEmbed()
        .setAuthor(member.user.tag, member.displayAvatarURL({ dynamic: true, size: 4096 }))
        .addField("<:join:906786246767038515> PNG",`[\`LINK\`](${member.displayAvatarURL({format: "png"})})`, true)
        .addField("<:join:906786246767038515> JPEG",`[\`LINK\`](${member.displayAvatarURL({format: "jpg"})})`, true)
        .addField("<:join:906786246767038515> WEBP",`[\`LINK\`](${member.displayAvatarURL({format: "webp"})})`, true)
        .setColor(ee.color)
        .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
        .setFooter(`Requested By: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()]});
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