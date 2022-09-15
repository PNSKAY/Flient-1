const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const weather = require('weather-js');

module.exports = {
  name: 'weather',
  aliases: [],
  usage: '[location]',
  description: 'Check the weather status of any location!',
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
      if (!args[0]) return message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(`**Please Enter A Location!**`)]})

      weather.find({
        search: args.join(" "),
        degreeType: 'C'
      }, function (err, result) {

        if (err) message.reply(err.message);

        if (result.length === 0) {
          message.reply({ embeds:[new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`**Please Enter A Valid Location.**`)]})
          return undefined;
        }

        var current = result[0].current;
        var location = result[0].location;

        message.reply({ embeds:[new MessageEmbed()
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Weather for ${current.observationpoint}`)
          .setThumbnail(current.imageUrl)
          .setColor(ee.color)
          .addField('**Timezone**', `UTC ${location.timezone}`, true)
          .addField('**Degree Type**', `${location.degreetype}`, true)
          .addField('**Temperature**', `${current.temperature} Degrees`, true)
          .addField('**Feels Like**', `${current.feelslike} Degrees`, true)
          .addField('**Winds**', `${current.winddisplay}`, true)
          .addField('**Humidity**', `${current.humidity}%`, true)
          .addField('**Date**', `${current.date}`, true)
          .addField('**Day**', `${current.day}`, true)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()]})
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