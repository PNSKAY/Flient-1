const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const rps = ['scissors', 'rock', 'paper'];
const res = [`Scissors ✂️`, `Rock 🪨`, `Paper 🗞️`];

module.exports = {
  name: "rps",
  aliases: [],
  usage: `rps rock`,
  description: "Plays rock paper scissor with the doggo !!",
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
      let userChoice;
      if (args.length) userChoice = args[0].toLowerCase();
      if (!rps.includes(userChoice))
        return message.reply({ embeds:[new MessageEmbed()
          .setColor(ee.mediancolor)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`${client.allEmojis.m} **Please enter rock, paper, or scissors**`)]});
      userChoice = rps.indexOf(userChoice);
      const botChoice = Math.floor(Math.random() * 3);
      let result;
      if (userChoice === botChoice) result = 'It\'s a draw no one wins';
      else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = `**${client.user.username}** Wins`;
      else result = `**${message.member.displayName}** Wins nice my dude !!`;
      message.reply({ embeds:[new MessageEmbed()
        .setTitle(`${message.member.displayName} vs ${client.user.username} **RPS**`)
        .addField(`${message.member.displayName}`, res[userChoice], true)
        .addField(`${client.user.username}`, res[botChoice], true)
        .addField('Results', result)
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()
        .setColor(ee.color)]});
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