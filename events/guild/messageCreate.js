const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing,
    onCoolDown,
    escapeRegex
} = require(`${process.cwd()}/structures/handlers/functions`);
const premiumServerModel = require(`${process.cwd()}/structures/models/premium-server`);

module.exports = {
    name: "messageCreate",

    /**
     * @param {Client} client 
     * @param {Message} message
     */

    async execute(client, message) {

        try {
            if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
            if (message.channel?.partial) await message.channel.fetch().catch(() => {});
            if (message.member?.partial) await message.member.fetch().catch(() => {});

            databasing(client, message.guild.id)
            embedDatabasing(client, message.guild.id)
            
            const guild_settings = client.settings.get(message.guild.id);
            const guild_settings2 = client.embedSettings.get(message.guild.id);

            let ee = guild_settings2.embed;

            let {
                prefix
            } = guild_settings;

            if (message.author.bot) return;

            if (prefix === null) prefix = config.env.PREFIX || process.env.PREFIX;

            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
            if (!prefixRegex.test(message.content)) return;
            const [, mPrefix] = message.content.match(prefixRegex);

            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
                return message.reply({
                    content: `❌ I am missing the Permission to \`USE_EXTERNAL_EMOJIS\``
                })
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS))
                return message.reply({
                    content: `${client.allEmojis.x} I am missing the Permission to \`EMBED_LINKS\``
                })
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS))
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`${client.allEmojis.x} I am missing the Permission to \`ADD_REACTIONS\``)
                    ]
                })

            const args = message.content.slice(mPrefix.length).trim().split(/ +/);
            const cmd = args.shift()?.toLowerCase();

            if (cmd.length === 0) {
                if (mPrefix.includes(client.user.id))
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setTitle(`${client.allEmojis.y} To See All Commands Type: \`${prefix}help\` or \`/help\``)
                        ]
                    }).catch(() => {});
                return;
            }

            let command = client.commands.get(cmd);
            if (!command) command = client.commands.get(client.aliases.get(cmd));
            if (command) {
                try {

                    let premiumServer = client.premiumServers.get(message.guild.id);
                    if (!premiumServer) {
                        const findPremiumServer = await premiumServerModel.findOne({
                            Id: message.guild.id
                        });
                        if (!findPremiumServer) {
                            const newPremiumServer = await premiumServerModel.create({
                                Id: message.guild.id
                            });
                            client.premiumServers.set(message.guild.id, newPremiumServer);
                            premiumServer = newPremiumServer;
                        };
                    }

                    if (command.premium && premiumServer && !premiumServer.isPremium) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`${client.allEmojis.x} Premium Commands`)
                                .setDescription(`This server is not a premium server!
                                If you are interested in buying **Premium** for your server!
                                Join **[Milanio Development](${process.env.SUPPORT})** And **Open a Ticket!**`)
                                .setColor(ee.wrongcolor)
                            ]
                        })
                    }

                    if (command.toggleOff) {
                        return await message.reply({
                            embeds: [new MessageEmbed()
                                .setDescription(`${client.allEmojis.x} **That Command Has Been Disabled By The Developers! Please Try Later.**`)
                                .setColor(ee.wrongcolor)
                            ]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => {
                                    console.log(String(e).grey)
                                })
                            }, 3000)
                        }).catch((e) => {
                            console.log(String(e).grey)
                        });
                    }
                    if (command.ownerOnly) {
                        if (!client.owners.includes(message.author.id)) return await message.reply({
                            embeds: [new MessageEmbed()
                                .setDescription(`${client.allEmojis.x} **You cannot use \`${prefix}${command.name}\` command as this is a developer command.**`)
                                .setColor(ee.wrongcolor)
                            ]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => {
                                    console.log(String(e).grey)
                                })
                            }, 3000)
                        }).catch((e) => {
                            console.log(String(e).grey)
                        });
                    }
                    if (!message.member.permissions.has(command.userPermissions)) return await message.reply({
                        embeds: [new MessageEmbed()
                            .setDescription(`${client.allEmojis.x} **You do not have \`${command.userPermissions}\` permission to use \`${prefix}${command.name}\` command!**`)
                            .setColor(ee.wrongcolor)
                        ]
                    }).catch((e) => {
                        console.log(e)
                    });
                    if (!message.guild.me.permissions.has(command.botPermissions)) return await message.reply({
                        embeds: [new MessageEmbed()
                            .setDescription(`${client.allEmojis.x} **I do not have \`${command.botPermissions}\` permission to use \`${prefix}${command.name}\` command!**`)
                            .setColor(ee.wrongcolor)
                        ]
                    }).catch((e) => {
                        console.log(e)
                    });
                    if (onCoolDown(message, command)) {
                        return await message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setDescription(`${client.allEmojis.x} **Please wait \`${onCoolDown(message, command).toFixed(1)} seconds\` Before using the \`${prefix}${command.name}\` command again!.**`)
                            ]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => {
                                    console.log(String(e).grey)
                                })
                            }, 3000)
                        }).catch((e) => {
                            console.log(String(e).grey)
                        });
                    }
                    command.execute(client, message, args, ee, prefix);
                    const commandLogsChannel = client.channels.cache.get(config.botlogs.commandLogsChannel);
                    if (!commandLogsChannel) return;
                    commandLogsChannel.send({
                        embeds: [new MessageEmbed()
                            .setColor("#00ffff")
                            .setAuthor(message.guild.name, message.guild.iconURL({
                                dynamic: true
                            }))
                            .setTitle(`<a:features:942097525878439967> Prefix Command`)
                            .addField("**<a:features:942097525878439967> Author**", `\`\`\`${message.author.tag}\`\`\``)
                            .addField("**<a:features:942097525878439967> Command Name**", `\`\`\`${command.name}\`\`\``)
                        ]
                    });
                } catch (error) {
                    console.log(error)
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`${client.allEmojis.x} Something went wrong while, running the: ${prefix}${command.name} command`)
                            .setDescription(`\`\`\`${error.message}\`\`\``)
                        ]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => {
                                console.log(String(e).grey)
                            })
                        }, 4000)
                    }).catch((e) => {
                        console.log(String(e).grey)
                    });
                }
            }
        } catch (e) {
            console.log(e)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    //.setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} ERROR | An error occurred`)
                    //.setFooter(ee.footertext, ee.footericon)
                    .setDescription(`\`\`\`${e.message}\`\`\``)
                ]
            });
        }
    }
};