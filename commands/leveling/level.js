const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment
} = require('discord.js');
const Levels = require('discord-xp');
const canvacord = require('canvacord');

module.exports = {
  name: 'level',
  aliases: ['rank', 'xp'],
  usage: '',
  description: "Returns a level of the user!",
  category: "leveling",
  cooldown: 10,
  userPermissions: "",
  botPermissions: "ATTACH_FILES",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee) {
    try {
      const target = message.mentions.users.first() || message.author;

      const user = await Levels.fetch(target.id, message.guild.id, true);

      if (!user) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`The member mentioned does not have any levels within the server.`)]});

      const neededXp = Levels.xpFor(parseInt(user.level) + 1)

      const img = "https://www.mandatory.gg/wp-content/uploads/news/2020/08/valorant-news-datamine-remake-rematch.jpg";

      const rank = new canvacord.Rank()
        .setAvatar(target.displayAvatarURL({
          dynamic: false,
          format: 'png',
          size: 512
        }))
      	//.setAvatar(target.displayAvatarURL({format: 'png', size: 512}))
        .setBackground("IMAGE", img)
        .setRank(user.position)
        .setLevel(user.level)
        .setCurrentXP(user.xp)
        .setRequiredXP(neededXp)
        // .setStatus(target.presence.status)
        // .setStatus(message.member.presence.status)
        .setProgressBar(ee.color, "COLOR")
        .setUsername(target.username)
        .setDiscriminator(target.discriminator);

      rank.build()
        .then(data => {
          const attachment = new MessageAttachment(data, "RankCard.png");
          message.reply({ files: [attachment]});
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
  },
};