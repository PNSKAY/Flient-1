const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const ee = require(`${process.cwd()}/structures/botconfig/embed.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const Discord = require("discord.js");
const {
    databasing,
    escapeRegex
} = require(`${process.cwd()}/structures/handlers/functions`);
const Schema = require(`${process.cwd()}/structures/models/music-request`);
const premiumServerModel = require(`${process.cwd()}/structures/models/premium-server`);
const fetch = require("node-fetch");

module.exports = async (client) => {
    const description = {
        name: "Music System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);


    client.on("interactionCreate", async (interaction) => {
        try {

            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            let premiumServer = client.premiumServers.get(interaction.guild.id);
            if (!premiumServer) {
                const findPremiumServer = await premiumServerModel.findOne({
                    Id: interaction.guild.id
                });
                if (!findPremiumServer) {
                    const newPremiumServer = await premiumServerModel.create({
                        Id: interaction.guild.id
                    });
                    client.premiumServers.set(interaction.guild.id, newPremiumServer);
                    premiumServer = newPremiumServer;
                };
            }

            if (interaction.isButton()) {
                if (!["music-skip", "music-pause", "music-resume", "music-stop", "music-shuffle", "music-autoplay", "music-loop", "music-queue", "music-10s-less", "music-10s-more", "music-lyrics", "music-volume-negative", "music-volume-plus"].includes(interaction.customId)) return;

                const {
                    options,
                    member,
                    guild,
                    channel
                } = interaction;
                const VoiceChannel = member.voice.channel;

                if (!VoiceChannel) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTimestamp()
                        .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
                    ],
                    ephemeral: true
                });

                if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTimestamp()
                        .setDescription(`**I am already playing music in <#${guild.me.voice.channelId}>**`)
                    ],
                    ephemeral: true
                });

                const queue = await client.distube.getQueue(VoiceChannel);
                if (!queue) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTimestamp()
                        .setTitle(`${client.allEmojis.x} There is no Song in the Queue.`)
                    ],
                    ephemeral: true
                });

                switch (interaction.customId) {
                    case "music-skip":
                        await queue.skip(VoiceChannel);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.skip} Skipped to the next Song!`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-pause":
                        if (premiumServer && !premiumServer.isPremium) {
                            return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`${client.allEmojis.x} Premium Commands`)
                                    .setDescription(`This server is not a premium server!
                                        If you are interested in buying **Premium** for your server!
                                        Join **[ALL IN ONE server](${process.env.SUPPORT})** And **Open a Ticket!**`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                        }

                        await queue.pause(VoiceChannel);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.pause} Song has been Paused!`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-resume":
                        if (premiumServer && !premiumServer.isPremium) {
                            return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`${client.allEmojis.x} Premium Commands`)
                                    .setDescription(`This server is not a premium server!
                                        If you are interested in buying **Premium** for your server!
                                        Join **[ALL IN ONE server](${process.env.SUPPORT})** And **Open a Ticket!**`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                        }

                        await queue.resume(VoiceChannel);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.resume} Song has been resumed`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        //interaction.deferUpdate();
                        break;
                    case "music-stop":
                        await queue.stop(VoiceChannel);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.stop} Stopped playing and Leaving the Voice Channel`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-shuffle":
                        await queue.shuffle(VoiceChannel);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.shuffle} Song has been shuffled`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-autoplay":
                        if (premiumServer && !premiumServer.isPremium) {
                            return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`${client.allEmojis.x} Premium Commands`)
                                    .setDescription(`This server is not a premium server!
                                        If you are interested in buying **Premium** for your server!
                                        Join **[ALL IN ONE server](${process.env.SUPPORT})** And **Open a Ticket!**`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                        }

                        let Mode = await queue.toggleAutoplay(VoiceChannel);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.autoplay} Autoplay Mode is set to: \`${Mode ? "On" : "Off"}\``)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-loop":
                        let Mode2 = await client.distube.setRepeatMode(queue);

                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.loop} Loop Mode is set to: \`${Mode2 = Mode2 ? Mode2 == 2 ? "Queue" : "Song" : "Off"}\``)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-queue":
                        const q = queue.songs.map((song, i) => `${i === 0 ? "**Playing:**" : `**${i})**`} ${song.name} - \`${song.formattedDuration}\``).join("\n").substr(0, 4000)

                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`${client.allEmojis.music.queue} Queue of ${interaction.guild.name}`)
                                .setDescription(`${q}`)
                            ],
                            ephemeral: true
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-10s-less":
                        let Seektime = queue.currentTime - 10;
                        if (Seektime < 0) Seektime = 0;
                        if (Seektime >= queue.songs[0].duration - queue.currentTime) Seektime = 0;
                        await queue.seek(Number(Seektime));
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.less10Sec} \`10s\` Rewinded the Song!`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-10s-more":
                        let Seektime2 = queue.currentTime + 10;
                        if (Seektime2 >= queue.songs[0].duration) Seektime2 = queue.songs[0].duration - 1;
                        await queue.seek(Number(Seektime2));
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.forward10Sec} \`10s\` Forwarded the Song!`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-volume-negative":
                        let Volume = queue.volume - 10;
                        if (Volume < 0) Volume = 0;

                        if (Volume < 10) return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.mediancolor)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.m} Volume Lowest is \`10\``)
                            ]
                        });

                        client.distube.setVolume(VoiceChannel, Volume);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.negative10vol} Volume has been set to \`${Volume}\`!`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-volume-plus":
                        let Volume2 = queue.volume + 10;

                        if (Volume2 > 150) return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.mediancolor)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.m} Volume Max is \`150\``)
                            ]
                        });

                        client.distube.setVolume(VoiceChannel, Volume2);
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setTimestamp()
                                .setTitle(`${client.allEmojis.music.plus10vol} Volume has been set to \`${Volume2}\`!`)
                                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            ]
                        });
                        // interaction.deferUpdate();
                        break;
                    case "music-lyrics":

                        await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(queue.songs[0].name)}`).then((response) => {
                            response.json().then((result) => {

                                if (result.error) return interaction.reply({
                                    embeds: [new MessageEmbed()
                                        .setTitle(`I was Unable to Find the Lyrics!`)
                                        .setColor(ee.wrongcolor)
                                    ],
                                    ephemeral: true
                                })

                                interaction.reply({
                                    embeds: [new MessageEmbed()
                                        .setAuthor(result.author, interaction.user.displayAvatarURL({
                                            dynamic: true
                                        }))
                                        .setColor(ee.color)
                                        .setTitle(result.title)
                                        .setDescription(` >>> ${String(result.lyrics).substr(0, 4000) || `I was Unable to Find the Lyrics!`}`)
                                        .setThumbnail(result.thumbnail.genius)
                                        .setURL(result.links.genius)
                                    ],
                                    ephemeral: true
                                })
                            })
                        })

                        // interaction.deferUpdate();
                        break;
                }
            }



            if (interaction.isSelectMenu()) {

                if (interaction.customId !== "Music-Menu-System") return;

                if (!["menu-music-song-1", "menu-music-song-2", "menu-music-song-3", "menu-music-song-4", "menu-music-song-5", "menu-music-song-6", "menu-music-song-7", "menu-music-song-8", "menu-music-song-9", "menu-music-song-10", "menu-music-song-11", "menu-music-song-12", "menu-music-song-13"].includes(interaction.values[0])) return;

                if (premiumServer && !premiumServer.isPremium) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.x} Premium Commands`)
                            .setDescription(`This server is not a premium server!
                                If you are interested in buying **Premium** for your server!
                                Join **[ALL IN ONE server](${process.env.SUPPORT})** And **Open a Ticket!**`)
                            .setColor(ee.wrongcolor)
                        ],
                        ephemeral: true
                    })
                }

                Schema.findOne({
                    Guild: interaction.guild.id
                }, async (e, data) => {
                    if (!data) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.x} Music Menu System`)
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setDescription(`No __Music Menu Channel__ Found`)
                        ],
                        ephemeral: true
                    })

                    const {
                        options,
                        member,
                        guild,
                        channel
                    } = interaction;

                    const VoiceChannel = member.voice.channel;

                    if (!VoiceChannel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setTimestamp()
                            .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
                        ],
                        ephemeral: true
                    });

                    if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setTimestamp()
                            .setDescription(`**I am already playing music in <#${guild.me.voice.channelId}>**`)
                        ],
                        ephemeral: true
                    });

                    switch (interaction.values[0]) {
                        case "menu-music-song-1":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **NCS | No Copyrighted Music**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-2":
                            client.distube.play(VoiceChannel, `https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Pop**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-3":
                            client.distube.play(VoiceChannel, `https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Default**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-4":
                            client.distube.play(VoiceChannel, `https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Rock**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-5":
                            client.distube.play(VoiceChannel, `https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Old Gaming**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-6":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Gaming**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-7":
                            client.distube.play(VoiceChannel, `https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Charts**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-8":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Chill**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-9":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Jazz**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-10":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Blues**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-11":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Strange Fruits**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-12":
                            client.distube.play(VoiceChannel, `https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Magic Release**`,
                                ephemeral: true
                            });
                            break;
                        case "menu-music-song-13":
                            client.distube.play(VoiceChannel, `https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe`, {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({
                                content: `>>> ${client.allEmojis.music.searching} Playing: **Metal**`,
                                ephemeral: true
                            });
                            break;
                    }
                })

            }

        } catch (err) {
            console.log(err)
        }
    })

    client.on("messageCreate", async (message) => {
        if (!message.guild) return;
        if (message.channel?.partial) await message.channel.fetch().catch(() => {});
        if (message.member?.partial) await message.member.fetch().catch(() => {});

        databasing(client, message.guild.id)
        const guild_settings = client.settings.get(message.guild.id);

        let ee = guild_settings.embed;

        let {
            prefix
        } = guild_settings;

        Schema.findOne({
            Guild: message.guild.id
        }, async (e, data) => {
            if (!data) return;

            const MenuMusicChannel = data.Channel;

            if (!MenuMusicChannel) return;

            if (MenuMusicChannel != message.channel.id) return;

            if (message.author.id === client.user.id) {
                await delay(5000);
                message.delete().catch((e) => {})
            } else {
                await delay(2500);
                message.delete().catch((e) => {})
            }

            if (message.author.bot) return;

            if (prefix === null) prefix = config.env.PREFIX || process.env.PREFIX;

            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);

            if (prefixRegex.test(message.content)) {

                const [, matchedPrefix] = message.content.match(prefixRegex);

                const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
                const cmd = args.shift().toLowerCase();

                if (cmd || cmd.length === 0) return

                const command = client.commands.get(cmd);
                if (!command) command = client.commands.get(client.aliases.get(cmd));
                if (command) {
                    return;
                }
            }

            const {
                member,
                guild,
            } = message;

            const {
                channel
            } = member.voice;

            const VoiceChannel = member.voice.channel;

            if (!VoiceChannel) return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTimestamp()
                    .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
                ]
            }).then(msg => {
                setTimeout(() => {
                    try {
                        msg.delete().catch(() => {});
                    } catch (e) {}
                }, 5000)
            })

            if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTimestamp()
                    .setTitle(`I am already playing music in <#${guild.me.voice.channelId}>`)
                ]
            })
            else {
                const queue = await client.distube.getQueue(VoiceChannel);

                message.channel.send({
                    content: `>>> ${queue?.songs?.length > 0 ? `${client.allEmojis.music.queue} Added to Queue` : `${client.allEmojis.music.play} Playing`}: **${message.content.trim().split(/ +/).join(" ")}**`,
                })

                await client.distube.play(VoiceChannel, message.content.trim().split(/ +/).join(" "), {
                    textChannel: message.channel,
                    member: member
                });
            }
        })

    })

}

function delay(delayInms) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}
