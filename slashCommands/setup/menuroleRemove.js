const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  CommandInteraction,
  MessageEmbed
} = require("discord.js");
const rrModel = require(`${process.cwd()}/structures/models/menu-role`)

module.exports = {
  name: 'menurole-remove',
  usage: '',
  description: 'remove a custom MenuRole',
  category: "setup",
  cooldown: 0,
  userPermissions: "MANAGE_ROLES",
  botPermissions: "MANAGE_ROLES",
  ownerOnly: false,
  toggleOff: false,
  options: [
    {
      name: "role",
      description: "role to be removed",
      type: "ROLE",
      required: true
    }
  ],

  /**
   * @param {Client} client 
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

   async execute(client, interaction, args, ee) {
    const role = interaction.options.getRole("role");

    const guildData = await rrModel.findOne({
      guildId: interaction.guildId
    })

    if (!guildData) return interaction.reply({ embeds: [new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setFooter(ee.footertext, ee.footericon)
    .setTitle(`${client.allEmojis.x} MenuRole System`)
    .setDescription(`**There is no Menu Role Exist**`)]});

    const guildRoles = guildData.roles;

    const findRole = guildRoles.find((x) => x.roleId === role.id);
    if (!findRole) return interaction.reply({ embeds: [new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setFooter(ee.footertext, ee.footericon)
    .setTitle(`${client.allEmojis.x} MenuRole System`)
    .setDescription(`**That role is not added to the Menu Roles List**`)]});

    const filteredRoles = guildRoles.filter((x) => x.roleId !== role.id)
    guildData.roles = filteredRoles;

    await guildData.save()

    interaction.reply({ embeds: [new MessageEmbed()
    .setColor(ee.color)
    .setFooter(ee.footertext, ee.footericon)
    .setTitle(`${client.allEmojis.y} MenuRole System`)
    .setDescription(`Successfully Removed: **${role.name}**`)]})
  }
}