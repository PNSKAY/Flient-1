const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const Schema = require(`${process.cwd()}/structures/models/anti-inviteLink`);

module.exports = async (client) => {
    const description = {
        name: "AntiDiscord System",
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

            const links = ['discord.gg/'];

            const forbiddenLinks = ['discord.io/', `discord.com/invite`];
            forbiddenLinks.forEach((link) => {
                if (message.content.includes(link)) return deleteMessage()
            })

            for (const link of links) {

                if (!message.content.includes(link)) return;

                const code = message.content.split(link)[1].split(" ")[0];
                const isGuildInvite = message.guild.invites.cache.has(code);

                if (!isGuildInvite) {
                    try {
                        const vanity = await message.guild.fetchVanityData();
                        if (code !== vanity?.code) return deleteMessage();
                    } catch (err) {
                        deleteMessage();
                    }
                }
            }

            function deleteMessage() {
                message.delete().catch(() => {});

                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setAuthor({
                            name: `Anti-Invite Link System`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTitle(`Invite Links are not allowed in this server.`)
                        .setThumbnail(message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setFooter({
                            text: `Anti-Invite Link System`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTimestamp()
                    ]
                })


                const loggigChannel = client.channels.cache.get(data.Channel);
                if (!loggigChannel) return;

                loggigChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setAuthor({
                            name: `Anti-Invite Link logging's`,
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
                        .setThumbnail(message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setFooter({
                            text: `Anti-Invite Link logging's`,
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