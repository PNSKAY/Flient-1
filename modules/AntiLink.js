const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const Schema = require(`${process.cwd()}/structures/models/antiLink`);

module.exports = async (client) => {
    const description = {
        name: "AntiLink System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("messageCreate", async (message) => {
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
        if (message.author.bot) return;

        databasing(client, message.guild.id)
        embedDatabasing(client, message.guild.id)

        const guild_settings = client.settings.get(message.guild.id);
        const guild_settings2 = client.embedSettings.get(message.guild.id);

        let ee = guild_settings2.embed;

        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

        if (message.guild.ownerID || message.member.permissions.has("MANAGE_MESSAGES") || message.author.bot) return;

        Schema.findOne({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return;

            if (message.content.includes("https://") || message.content.includes("http://") || message.content.includes("discord.gg/")) {
                message.delete().catch(() => {});
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setAuthor({
                            name: `AntiLink System`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTitle(`Links are not allowed in this server.`)
                        .setFooter({
                            text: `AntiLink System`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTimestamp()
                    ]
                })

                const LoggingChannel = client.channels.cache.get(data.Channel);
                if (!LoggingChannel) return;

                LoggingChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setAuthor({
                            name: `AntiLink Logging's`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setFields({
                            name: `Author`,
                            value: `${message.author}`
                        }, {
                            name: `Link`,
                            value: `\`\`\`${message.cleanContent.toString()}\`\`\``
                        })
                        .setFooter({
                            text: `AntiLink Logging's`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTimestamp()
                    ]
                })

            }


        })


    })


};