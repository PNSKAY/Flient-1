const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const roleData = require(`${process.cwd()}/structures/models/autorole`)

module.exports = {
    name: 'set-autorole',
    aliases: [],
    usage: '',
    description: '',
    category: "setup",
    cooldown: 0,
    userPermissions: "ADMINISTRATOR",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee, prefix) {

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        const data = await roleData.findOne({
            GuildID: message.guild.id,
        })
        if (!args[0]) return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`${client.allEmojis.m} AutoRole System`)
                .setDescription(`You must mention a role to set **Auto-Role**.`)
                .setColor(ee.mediancolor)
            ]
        })
        if (!role) return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`${client.allEmojis.x} AutoRole System`)
                .setColor(ee.wrongcolor)
                .setDescription(`The role mention does not exist.`)
            ]
        });
        if (message.member.roles.highest.position <= role.position) return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`${client.allEmojis.x} AutoRole System`)
                .setColor(ee.wrongcolor)
                .setDescription(`You cannot set this role as it is the same or above your current highest role.`)
            ]
        });
        if (message.guild.me.roles.highest.position <= role.position) return message.reply({
            embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`${client.allEmojis.x} AutoRole System`)
                .setDescription(`I cannot set this roles as this role is the same or higher then my role.`)
            ]
        });

        if (role) {
            if (data) {
                if (data.Role === role.id) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.m} AutoRole System`)
                            .setDescription(`Autorole is already set to <@&${data.Role}>`)
                            .setColor(ee.mediancolor)
                        ]
                    })
                } else if (data.Role !== role.id) {
                    await roleData.findOneAndRemove({
                        GuildID: message.guild.id,
                    })
                    let newD = new roleData({
                        Role: role.id,
                        GuildID: message.guild.id,
                    })
                    newD.save()
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.y} AutoRole System`)
                            .setDescription(`**AutoRole** set to ${role}`)
                            .setColor(ee.color)
                        ]
                    })
                }
            } else if (!data) {
                let newData = new roleData({
                    Role: role.id,
                    GuildID: message.guild.id,
                })
                newData.save()
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.y} AutoRole System`)
                        .setDescription(`**AutoRole** set to ${role}`)
                        .setColor(ee.color)
                    ]
                })
            }
        }
    }
}