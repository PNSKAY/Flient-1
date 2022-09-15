const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const moment = require("moment");
const schema = require(`${process.cwd()}/structures/models/premium-code`);
const User = require(`${process.cwd()}/structures/models/premium-server`);

module.exports = {
    name: "premium-remove",
    aliases: [],
    usage: '',
    description: "",
    category: "",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    premium: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee, prefix) {
        try {

            if (!message.member.roles.cache.has(client.premiumActivator)) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.x} Premium System`)
                    .setDescription(`You don't have permission to use these commands!`)
                    .setColor(ee.wrongcolor)
                ]
            })

            if (!args[0]) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.m} Premium System`)
                    .setDescription(`Please provide the server id you want to remove the premium!`)
                    .setColor(ee.mediancolor)
                ]
            });

            if (!client.guilds.cache.get(args[0])) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.x} Premium System`)
                    .setDescription(`Please provide a valid server id`)
                    .setColor(ee.wrongcolor)
                ]
            });

            let data = client.premiumServers.get(args[0]);
            if (!data.isPremium) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.x} Premium System`)
                        .setDescription(`**${client.guilds.cache.get(args[0]).name}** is Not a Premium Server!`)
                        .setColor(ee.wrongcolor)
                    ]
                });

            } else {
                await User.findOneAndRemove({
                    Id: args[0]
                });
                await client.premiumServers.delete(args[0]);
                message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.y} Premium System`)
                        .setDescription(`Removed Premium for **${client.guilds.cache.get(args[0]).name}**!`)
                        .setColor(ee.color)
                    ]
                });

                const premiumLog = client.channels.cache.get(config.botlogs.premiumLogChannel)
                if (!premiumLog) return;

                return premiumLog.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`__Premium Subscription Removed:__`)
                        .setDescription(`**Premium Subscription** Removed for **${client.guilds.cache.get(args[0]).name}**
**Removed By:** ${message.author.tag} (||${message.author.id}||)`)
                        .setThumbnail(`${client.guilds.cache.get(args[0]).iconURL({
                        dynamic: true
                      })}`)
                        .setFooter({
                            text: `${client.guilds.cache.get(args[0]).name} is no more a Premium Server!`
                        })
                        .setTimestamp()
                    ]
                })
            }
        } catch (e) {
            console.log(e)
        }
    },
};