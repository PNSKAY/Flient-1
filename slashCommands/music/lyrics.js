const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: 'lyrics',
    usage: '',
    description: 'Lyrics of the Song',
    category: "music",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
        name: "song_name",
        description: "Provide a name the song",
        type: "STRING",
        required: false,
    }],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        const {
            options,
            member,
            guild,
            channel
        } = interaction;

        const VoiceChannel = member.voice.channel;



        try {
            let songName = options.getString("query")

            if (songName) {
                await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(songName)}`).then((response) => {
                    response.json().then((result) => {

                        if (result.error) return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`I was Unable to Find the Lyrics!`)
                                .setColor("#FFD700")
                            ],
                            ephemeral: true
                        })

                        interaction.reply({
                            embeds: [new MessageEmbed()
                                .setAuthor(result.author, interaction.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setColor("#FFD700")
                                .setTitle(result.title)
                                .setDescription(` >>> ${String(result.lyrics).substr(0, 4000) || `I was Unable to Find the Lyrics!`}`)
                                .setThumbnail(result.thumbnail.genius)
                                .setURL(result.links.genius)
                            ],
                            ephemeral: true
                        })
                    })
                })
            } else {
                if (!VoiceChannel) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor("#FFD700")
                        .setTimestamp()
                        .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
                    ],
                    ephemeral: true
                });

                if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor("#FFD700")
                        .setTimestamp()
                        .setTitle(`I am already playing music in <#${guild.me.voice.channelId}>`)
                    ],
                    ephemeral: true
                });

                const queue = await client.distube.getQueue(VoiceChannel);
                if (!queue) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor("#FFD700")
                        .setTimestamp()
                        .setTitle(`${client.allEmojis.x} There is no Song in the Queue.`)
                    ],
                    ephemeral: true
                });

                await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(queue.songs[0].name)}`).then((response) => {
                    response.json().then((result) => {

                        if (result.error) return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`I was Unable to Find the Lyrics!`)
                                .setColor("#FFD700")
                            ],
                            ephemeral: true
                        })

                        interaction.reply({
                            embeds: [new MessageEmbed()
                                .setAuthor(result.author, interaction.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setColor("#FFD700")
                                .setTitle(result.title)
                                .setDescription(` >>> ${String(result.lyrics).substr(0, 4000) || `I was Unable to Find the Lyrics!`}`)
                                .setThumbnail(result.thumbnail.genius)
                                .setURL(result.links.genius)
                            ],
                            ephemeral: true
                        })
                    })
                })
            }

        } catch (e) {
            console.log(e)
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`⛔ Error`)
                    .setDescription(`${e}`)
                ]
            })
        }

    }
}