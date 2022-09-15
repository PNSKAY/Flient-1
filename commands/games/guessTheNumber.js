const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const guildNumber = new Map();
const guildAttempts = new Map();

module.exports = {
  name: "guess-the-number",
  aliases: ['gtn'],
  usage: '',
  description: 'Play Guess The Number',
  category: "games",
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
      const {
        member,
        channel,
        guild
      } = message;

      await guildNumberMap(message);
      await guildAttemptsMap(message);

      let guess = args[0];
      if (!guess && guildAttempts.get(guild.id).attempts === 1) {
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} **Pick a number between 1 and 20000**`)]})
      } else if (!guess) {
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} **Please provide a guess!**`)]});
      }

      if (+guess === guildNumber.get(guild.id)) {
        let attempts = guildAttempts.get(guild.id);

        message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.y} **Perfect, <@${member.id}>the number was ${guildNumber.get(guild.id)}, it only took you ${attempts.attempts} attempts!**`)]});
        guildNumber.delete(guild.id);
        guildAttempts.delete(guild.id);


        return;
      } else if (+guess < guildNumber.get(guild.id)) {
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.m} **${guess} Is too low!**`)]});
      } else if (+guess > guildNumber.get(guild.id)) {
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.m} **${guess} Is too high!**`)]});
      } else {
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.x} **Invalid number please try again**`)]});
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
  },
};

function guildNumberMap(message) {
  const guildId = message.guild.id;

  var number = Math.floor(Math.random() * 20000) + 1;
  // If there is no command running map for the guild, create one
  if (!guildNumber.get(guildId)) {
    guildNumber.set(guildId, number);
  }
}

function guildAttemptsMap(message) {
  const guildId = message.guild.id;
  // If there is no command running map for the guild, create one
  if (!guildAttempts.get(guildId)) {
    guildAttempts.set(guildId, {
      attempts: 1
    });
  } else {
    guildAttempts.get(guildId).attempts++;
  }
}