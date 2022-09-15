const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
    name: 'lyrics',
    aliases: [],
    usage: '',
    description: '',
    category: "music",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee) {
        try {

            const {
                member,
                guild,
            } = message;

            const {
                channel
            } = member.voice;


            const VoiceChannel = member.voice.channel;


            if (args[0]) {
                await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(args.join(" "))}`).then((response) => {
                    response.json().then((result) => {

                        if (result.error) return message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`I was Unable to Find the Lyrics!`)
                                .setColor(ee.wrongcolor)
                            ]
                        })

                        message.reply({
                            embeds: [new MessageEmbed()
                                .setAuthor(result.author, message.author.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setColor(ee.color)
                                .setTitle(result.title)
                                .setDescription(` >>> ${String(result.lyrics).substr(0, 4000) || `I was Unable to Find the Lyrics!`}`)
                                .setThumbnail(result.thumbnail.genius)
                                .setURL(result.links.genius)
                            ]
                        })
                    })
                })
            } else {
                if (!VoiceChannel) return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTimestamp()
                        .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
                    ]
                });

                if (channel.userLimit != 0 && channel.full)
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`Your Voice Channel is full, I can't join!`)
                        ]
                    });


                if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTimestamp()
                        .setDescription(`**I am already playing music in <#${guild.me.voice.channelId}>**`)
                    ]
                });

                await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(queue.songs[0].name)}`).then((response) => {
                    response.json().then((result) => {

                        if (result.error) return message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`I was Unable to Find the Lyrics!`)
                                .setColor(ee.wrongcolor)
                            ]
                        })

                        message.reply({
                            embeds: [new MessageEmbed()
                                .setAuthor(result.author, message.author.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setColor(ee.color)
                                .setTitle(result.title)
                                .setDescription(` >>> ${String(result.lyrics).substr(0, 4000) || `I was Unable to Find the Lyrics!`}`)
                                .setThumbnail(result.thumbnail.genius)
                                .setURL(result.links.genius)
                            ]
                        })
                    })
                })
            }

        } catch (e) {
            console.log(e)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`⛔ Error`)
                    .setDescription(`${e}`)
                ]
            })
        }
    }
}