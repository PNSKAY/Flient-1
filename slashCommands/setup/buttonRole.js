const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  CommandInteraction,
  MessageEmbed
} = require("discord.js");

module.exports = {
    name: "button-role",
    usage: '',
    description: "Button Role",
    category: "setup",
    cooldown: 0,
    userPermissions: "MANAGE_ROLES",
    botPermissions: "MANAGE_ROLES",
    ownerOnly: false,
    toggleOff: true,
    options: [{
            name: "role1",
            description: "Set the first role",
            type: "ROLE",
            required: true,
        },
        {
            name: "role2",
            description: "Set the second role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role3",
            description: "Set the third role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role4",
            description: "Set the fourth role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role5",
            description: "Set the fifth role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role6",
            description: "Set the sixth role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role7",
            description: "Set the seventh role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role8",
            description: "Set the eighth role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role9",
            description: "Set the ninth role",
            type: "ROLE",
            required: false,
        },
        {
            name: "role10",
            description: "Set the tenth role",
            type: "ROLE",
            required: false,
        },
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {

        const role1 = interaction.options.getRole("role1");
        const role2 = interaction.options.getRole("role2");
        const role3 = interaction.options.getRole("role3");
        const role4 = interaction.options.getRole("role4");
        const role5 = interaction.options.getRole("role5");
        const role6 = interaction.options.getRole("role6");
        const role7 = interaction.options.getRole("role7");
        const role8 = interaction.options.getRole("role8");
        const role9 = interaction.options.getRole("role9");
        const role10 = interaction.options.getRole("role10");

        if (interaction.member.roles.highest.position <= role1.position) return interaction.reply({
            embeds: [new MessageEmbed()
                .setColor("#FFD700")
                .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                .setTitle(`${client.allEmojis.x} ButtonRole System`)
                .setDescription(`${client.allEmojis.x} You cannot access this ${role1} role as it is the same or above your current highest role.`)
            ]
        });
        if (role2) {
            if (interaction.member.roles.highest.position <= role2.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role2} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role3) {
            if (interaction.member.roles.highest.position <= role3.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role3} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role4) {
            if (interaction.member.roles.highest.position <= role4.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role4} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role5) {
            if (interaction.member.roles.highest.position <= role5.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role5} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role6) {
            if (interaction.member.roles.highest.position <= role6.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role6} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role7) {
            if (interaction.member.roles.highest.position <= role7.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role7} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role8) {
            if (interaction.member.roles.highest.position <= role8.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role8} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role9) {
            if (interaction.member.roles.highest.position <= role9.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role9} role as it is the same or above your current highest role.`)
                ]
            })
        }
        if (role10) {
            if (interaction.member.roles.highest.position <= role10.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`${client.allEmojis.x} You cannot access this ${role10} role as it is the same or above your current highest role.`)
                ]
            })
        }



        if (role1.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
            embeds: [new MessageEmbed()
                .setColor("#FFD700")
                .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                .setTitle(`${client.allEmojis.x} ButtonRole System`)
                .setDescription(`**I cannot assis this ${role1} role as this role is the same or higher then mine.**`)
            ]
        });
        if (role2) {
            if (role2.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role2} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role3) {
            if (role3.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role3} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role4) {
            if (role4.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role4} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role5) {
            if (role5.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role5} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role6) {
            if (role6.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role6} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role7) {
            if (role7.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role7} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role8) {
            if (role8.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role8} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role9) {
            if (role9.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role9} role as this role is the same or higher then mine.**`)
                ]
            })
        }
        if (role10) {
            if (role10.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setFooter(`DECΩDERS™`, `https://cdn.discordapp.com/icons/905075946426613760/a_b4d47f7be31abeb7bb5c871a13de8610.gif`)
                    .setTitle(`${client.allEmojis.x} ButtonRole System`)
                    .setDescription(`**I cannot assis this ${role10} role as this role is the same or higher then mine.**`)
                ]
            })
        }

        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
            .setLabel(`${role1.name}`)
            .setStyle("SECONDARY")
            .setCustomId(`${role1.id}`)
        );
        if (role2) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role2.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role2.id}`)
            );
        }
        if (role3) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role3.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role3.id}`)
            );
        }
        if (role4) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role4.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role4.id}`)
            );
        }
        if (role5) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role5.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role5.id}`)
            );
        }
        if (role6) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role6.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role6.id}`)
            );
        }
        if (role7) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role7.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role7.id}`)
            );
        }
        if (role8) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role8.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role8.id}`)
            );
        }
        if (role9) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role9.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role9.id}`)
            );
        }
        if (role10) {
            row.addComponents(
                new MessageButton()
                .setLabel(`${role10.name}`)
                .setStyle("SECONDARY")
                .setCustomId(`${role10.id}`)
            );
        }

        const buttonEmbed = new MessageEmbed()
            .setTitle(`${client.allEmojis.y} Please select a role below`)
            .setColor(ee.color)

        interaction.reply({
            content: `ButtonRole is Ready`
        })
        interaction.channel.send({
            embeds: [buttonEmbed],
            components: [row]
        });

    },
};