const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const moment = require("moment");
const schema = require(`${process.cwd()}/structures/models/premium-code`);
const Servers = require(`${process.cwd()}/structures/models/premium-server`);

module.exports = {
    name: "premium-redeem",
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

            let servers = await Servers.findOne({
                Id: message.guild.id,
            });

            let code = args[0];

            if (!code) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.m} Premium System`)
                        .setDescription(`Please provide the code you want to redeem!`)
                        .setColor(ee.mediancolor)
                    ]
                });
            }

            if (servers && servers.isPremium) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.x} Premium System`)
                        .setDescription(`**${message.guild.name}** is already a **Premium Server**!`)
                        .setColor(ee.wrongcolor)
                    ]
                });
            }

            const premium = await schema.findOne({
                code: code.toUpperCase(),
            });

            if (premium) {
                const expires = moment(premium.expiresAt).format("dddd, MMMM Do YYYY HH:mm:ss");

                servers.isPremium = true;
                servers.premium.redeemedBy.push(message.author);
                servers.premium.redeemedAt = Date.now();
                servers.premium.expiresAt = premium.expiresAt;
                servers.premium.plan = premium.plan;

                servers = await servers.save({
                    new: true
                }).catch(() => {});
                client.premiumServers.set(message.guild.id, servers);
                await premium.deleteOne().catch(() => {});

                message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.y} Premium System`)
                        .setDescription(`You have Successfully Redeemed Premium!
Expires at: ${expires}`)
                        .setColor(ee.color)
                    ]
                });

                const premiumLog = client.channels.cache.get(config.botlogs.premiumLogChannel)
                if (!premiumLog) return;

                return premiumLog.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`__Redeemed New Premium Subscription:__`)
                        .setDescription(`**${message.guild.name}** is added to **Premium Server List!**
**Redeem Code:** ||\`${code}\`||
**Expires At:** ${moment(premium.expiresAt).format("dddd, MMMM Do YYYY")}
**Redeem By:** ${message.author.tag} (||${message.author.id}||)`)
                        .setThumbnail(`${message.guild.iconURL({
                        dynamic: true
                      })}`)
                        .setFooter({
                            text: `${message.guild.name} is now a Premium Server!`
                        })
                        .setTimestamp()
                    ]
                })

            } else {

                return message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.x} Premium System`)
                        .setDescription(`The code you are trying to redeem is not a valid one or expired!
If you buyed and the code is not working contact **[Milanio Development](${process.env.SUPPORT})**`)
                        .setColor(ee.wrongcolor)
                    ]
                });

            }
        } catch (e) {
            console.log(e)
        }
    },
};