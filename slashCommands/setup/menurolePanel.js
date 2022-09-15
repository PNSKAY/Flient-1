const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} = require("discord.js");
const rrModel = require(`${process.cwd()}/structures/models/menu-role`);

module.exports = {
    name: 'menurole-panel',
    usage: '',
    description: 'Menu for the MenuRole',
    category: "setup",
    cooldown: 0,
    userPermissions: "MANAGE_ROLES",
    botPermissions: "MANAGE_ROLES",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        try {

            const guildData = await rrModel.findOne({
                guildId: interaction.guildId
            });

            if (!guildData?.roles) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.x} MenuRole System`)
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`**There is no MenuRole Exist**`)
                ]
            });

            const options = guildData.roles.map((x) => {
                const role = interaction.guild.roles.cache.get(x.roleId);

                return {
                    label: x.MenuName,
                    value: role.id,
                    description: x.roleDescription || "No description",
                    emoji: x.roleEmoji
                };
            });

            const panelEmbed = new MessageEmbed()
                .setTitle(`${client.allEmojis.y} Please select a role below`)
                .setColor(ee.color)

            const components = [
                new MessageActionRow()
                .addComponents(new MessageSelectMenu()
                    .setCustomId("reaction-roles")
                    .setMaxValues(1)
                    .addOptions(options))
            ];

            interaction.reply({
                content: `MenuRole is Ready`
            })
            interaction.channel.send({
                embeds: [panelEmbed],
                components
            })
        } catch (err) {
            console.log(err)
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} Error:`)
                    .setDescription(err)
                ]
            })
        }
    }
}