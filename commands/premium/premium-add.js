const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const moment = require("moment");
const Servers = require(`${process.cwd()}/structures/models/premium-server`);

module.exports = {
    name: "premium-add",
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
                    .setDescription(`Please provide the server id to make the server premium!`)
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

            let servers = await Servers.findOne({
                Id: args[0],
            });

            if (servers && servers.isPremium) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.x} Premium System`)
                        .setDescription(`**${client.guilds.cache.get(args[0]).name}** is already a **Premium Server**!`)
                        .setColor(ee.wrongcolor)
                    ]
                });
            }

            let plan = args[1];
            const plans = ["monthly", "yearly"];
            if (!plan) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.x} Premium System`)
                    .setDescription(`Please provide a valid plan!
Avalable Plans: \`monthly\` \`yearly\``)
                    .setColor(ee.wrongcolor)
                ]
            });

            if (!plans.includes(plan.toLowerCase())) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.x} Premium System`)
                    .setDescription(`Please provide a valid plan!
                    Avalable Plans: \`monthly\` \`yearly\``)
                    .setColor(ee.wrongcolor)
                ]
            });

            let time;
            // if (plan === "daily") time = Date.now() + 86400000;
            // if (plan === "weekly") time = Date.now() + 86400000 * 7;
            if (plan === "monthly") time = Date.now() + 86400000 * 30;
            if (plan === "yearly") time = Date.now() + 86400000 * 365;

            servers.isPremium = true;
            servers.premium.redeemedBy.push(message.author);
            servers.premium.redeemedAt = Date.now();
            servers.premium.expiresAt = time;
            servers.premium.plan = plan;

            servers = await servers.save({
                new: true
            }).catch(() => {});

            client.premiumServers.set(args[0], servers);

            message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.y} Premium System`)
                    .setDescription(`**${client.guilds.cache.get(args[0]).name}** is now **Premium Server!**
Expires at: **${moment(time).format("dddd, MMMM Do YYYY")}**`)
                    .setColor(ee.color)
                ]
            });

            const premiumLog = client.channels.cache.get(config.botlogs.premiumLogChannel)
            if (!premiumLog) return;

            return premiumLog.send({
                embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTitle(`__New Premium Subscription:__`)
                    .setDescription(`**${client.guilds.cache.get(args[0]).name}** is added to **Premium Server List!**
**Expires At:** ${moment(time).format("dddd, MMMM Do YYYY")}
**Added By:** ${message.author.tag} (||${message.author.id}||)`)
                    .setThumbnail(`${client.guilds.cache.get(args[0]).iconURL({
                        dynamic: true
                      })}`)
                    .setFooter({
                        text: `${client.guilds.cache.get(args[0]).name} is now a Premium Server!`
                    })
                    .setTimestamp()
                ]
            })

        } catch (e) {
            console.log(e)
        }
    },
};