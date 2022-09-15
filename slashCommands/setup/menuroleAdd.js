const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const rrModel = require(`${process.cwd()}/structures/models/menu-role`);

module.exports = {
    name: 'menurole-add',
    usage: '',
    description: 'Add a custom reaction role',
    category: "setup",
    cooldown: 0,
    userPermissions: "MANAGE_ROLES",
    botPermissions: "MANAGE_ROLES",
    ownerOnly: false,
    toggleOff: false,
    options: [{
            name: "menu-name",
            description: "name to be assigned to menu",
            type: "STRING",
            required: true
        },
        {
            name: "role",
            description: "role to be assigned",
            type: "ROLE",
            required: true
        },
        {
            name: "description",
            description: "description of this menu role",
            type: "STRING",
            required: false
        },
        {
            name: "emoji",
            description: "emoji for the menu role",
            type: "STRING",
            required: false
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        const MenuName = interaction.options.getString("menu-name");
        const role = interaction.options.getRole("role");
        const roleDescription = interaction.options.getString("description") || null;
        const roleEmoji = interaction.options.getString("emoji") || null;

        if (interaction.member.roles.highest.position <= role.position) return interaction.reply({
            embeds: [new MessageEmbed()
                .setColor("#FFD700")
                .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                .setTitle(`${client.allEmojis.x} MenuRole System`)
                .setDescription(`${client.allEmojis.x} You cannot access this ${role} role as it is the same or above your current highest role.`)
            ]
        });

        if (role.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
            embeds: [new MessageEmbed()
                .setColor("#FFD700")
                .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                .setTitle(`${client.allEmojis.x} MenuRole System`)
                .setDescription(`**I cannot assis this ${role} role as this role is the same or higher then mine.**`)
            ]
        });

        const guildData = await rrModel.findOne({
            guildId: interaction.guildId
        })

        const newRole = {
            MenuName,
            roleId: role.id,
            roleDescription,
            roleEmoji,
        }

        if (guildData) {
            const roleData = guildData.roles.find((x) => x.roleId === role.id)

            if (roleData) {
                roleData = newRole;
            } else {
                guildData.roles = [...guildData.roles, newRole]
            }

            await guildData.save()
        } else {
            await rrModel.create({
                guildId: interaction.guildId,
                roles: newRole
            })
        }

        interaction.reply({
            embeds: [new MessageEmbed()
                .setTitle(`${client.allEmojis.y} MenuRole System`)
                .setColor("#FFD700")
                .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                .setDescription(`Created a new role: **${role.name}**`)
            ]
        });
    }
}