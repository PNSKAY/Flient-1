const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'owner-announce',
  aliases: [],
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
    try{
    const msg = args.join(" ")
    if (!msg) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`Please supply the message to sent to owners`)
      ]
    })

    client.guilds.cache.forEach(async (e) => {
      const ower = await client.users.fetch(e.ownerId)

      const embed = new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`📬┃Important Message From Owners`)
        .setDescription(`${msg}`)
      ower.send({
        embeds: [embed]
      })
    })

    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`Sending to Owners`)
      ]
    })
    } catch (err) {
      console.log("I was unable to send the Message to the owner")
    }
  }
}