const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: "topservers",
  aliases: ["topserver"],
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
    try {
      const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(20);

      const descriptions = guilds.map((guild, index) => {
        return `${index + 1}) ${guild.name} -> ${guild.memberCount} members`;
      }).join("\n");

      message.channel.send({ embeds: [new MessageEmbed()
        .setTitle(`${client.allEmojis.y} Top Guilds`)
        .setFooter(ee.footertext, ee.footericon)
        .setDescription(descriptions)
        .setColor(ee.color)]})
    } catch (e) {
      console.log(e)
    }
  },
};