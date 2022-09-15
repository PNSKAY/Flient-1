const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require("discord.js");
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const Schema = require(`${process.cwd()}/structures/models/ghostPing`);

module.exports = async (client) => {
    const description = {
        name: "GhostPing System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("messageDelete", async (message) => {
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId || message.author.bot) return;

        databasing(client, message.guild.id)
        embedDatabasing(client, message.guild.id)

        const guild_settings = client.settings.get(message.guild.id);
        const guild_settings2 = client.embedSettings.get(message.guild.id);

        let ee = guild_settings2.embed;

        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;


        Schema.findOne({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return;

            let member = message.mentions.members.first();

            if (member) {
                if (member.id === message.author.id) return;

                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setAuthor({
                            name: `Ghostping Detected`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setThumbnail(member.displayAvatarURL({
                            dynamic: true
                        }))
                        .addFields([{
                                name: `Author`,
                                value: `${message.author}`,
                            },
                            {
                                name: `Content`,
                                value: `\`\`\`${message.cleanContent.toString()}\`\`\``,
                            },
                        ])
                        .setFooter({
                            text: `GhostPing Detected`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTimestamp()
                    ],
                });

                const loggingChannel = client.channels.cache.get(data.Channel);
                if (!loggingChannel) return;

                loggingChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setAuthor({
                            name: `GhostPing Logging`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setFields({
                            name: `Author`,
                            value: `${message.author}`
                        }, {
                            name: `Content`,
                            value: `\`\`\`${message.cleanContent.toString()}\`\`\``
                        })
                        .setThumbnail(member.displayAvatarURL({
                            dynamic: true
                        }))
                        .setFooter({
                            text: `GhostPing Logging`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setTimestamp()
                    ]
                })

            }
        })

    });

}