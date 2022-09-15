const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: '8ball',
  aliases: ['8b'],
  usage: '',
  description: '8ball command',
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
      if (!args[0]) return message.reply({
        embeds: [new MessageEmbed()
          .setFooter(ee.footertext, ee.footericon)
          .setColor(ee.mediancolor)
          .setDescription(`${client.allEmojis.m} **Please ask a question!**`)
        ]
      })
      let replies = [
        'yes.',
        'Outlook seems good.',
        'wow', 'of course,',
        'Yes - definitely',
        'no.',
        'Better not tell you now.',
        'Outlook is not so good..',
        'never', 'Cannot predict now',
        'I dont know.',
        'I dont know *yet*...',
        'not a chance.',
        'I think so.',
        'only for today!',
        'not for today c:',
        'sadly yes..',
        'sadly no..',
        'maybe!',
        'ask again.. later..',
        'Maybe.',
        'Certainly not.',
        'I hope so.',
        'Not in your wildest dreams.',
        'There is a good chance.',
        'Quite likely.',
        'I think so.',
        'I hope not.',
        'I hope so.',
        'Never!',
        'Fuhgeddaboudit.',
        'Ahaha! Really?!?',
        'Pfft.',
        'Sorry, bucko.',
        'Hell, yes.',
        'Hell to the no.',
        'The future is bleak.',
        'The future is uncertain.',
        'I would rather not say.',
        'Who cares?',
        'Possibly.',
        'Never, ever, ever.',
        'There is a small chance.',
        'Yes!'
      ];

      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice().join(" ");

      message.reply({
        embeds: [new MessageEmbed()
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(`🎱 8Ball!`)
          .setColor(ee.color)
          .addField("Question", question)
          .addField("Answer", replies[result])
        ]
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