const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const glob = require('glob');

module.exports = {
  name: 'reset-bot',
  aliases: [],
  usage: '',
  description: 'Reset the bot',
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
      const msg = await message.reply({ embeds:[new MessageEmbed()
        .setColor(ee.mediancolor)
        .setDescription(`Bot is Resetting...`)]});
      await client.destroy();
      await client.login(process.env.TOKEN);
      await msg.edit({ embeds:[new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`${client.allEmojis.y} Successfully Resetted`)]});
    } catch (e) {
      message.channel.send({ content: `Error: ${e.message}` })
    }
  },
};