const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const eec = require(`${process.cwd()}/structures/botconfig/embed.json`);
const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');

module.exports = {
  name: 'invite',
  aliases: ['invite-me'],
  usage: '',
  description: 'Give You My Invite Link',
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

    let embed = new MessageEmbed()
      .setTitle(`<a:badge1:946812395362328667> Invite ${client.user.tag}`)
      .setDescription(`||[*Click Here To Invite *](https://discord.com/api/oauth2/authorize?client_id=935189268089929838&permissions=8&scope=bot%20applications.commands)||`)
      .setColor(ee.color)
      //.setImage(eec.gif)
      .setFooter(ee.footertext, ee.footericon)

    let supportbutton = new MessageButton()
            .setStyle("LINK")
            .setLabel("Join Support!")
            .setEmoji('946812395362328667')
            .setURL(process.env.SUPPORT)  

    let invitebutton = new MessageButton()
            .setStyle("LINK")
            .setLabel("Invite Me!")
             .setEmoji('946812395362328667')
            .setURL(process.env.INVITE)

  //  let websitebutton = new MessageButton()
          //  .setStyle("LINK")
          // .setLabel("Check Website!")
            // .setEmoji('🌐')
           // .setURL(process.env.WEBSITE)

    const row = new MessageActionRow()
        .addComponents(supportbutton, invitebutton//, websitebutton
                      );

    return message.reply({
        embeds: [embed],
        components: [row]
    }).catch(err => console.log(err));
    
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