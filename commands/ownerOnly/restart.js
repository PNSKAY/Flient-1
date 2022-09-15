const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const glob = require('glob');

module.exports = {
  name: 'restart-bot',
  aliases: [],
  usage: '',
  description: 'Shutdown the bot',
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
      await message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(`Bot is Restarting...`)]});
        process.exit();
    } catch (e) {
      message.channel.send({content: `Error: ${e.message}`})
    }
  },
};