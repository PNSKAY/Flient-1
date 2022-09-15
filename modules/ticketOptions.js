const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const ee = require(`${process.cwd()}/structures/botconfig/embed.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const Discord = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const Data = require(`${process.cwd()}/structures/models/ticket-user`);
const Data2 = require(`${process.cwd()}/structures/models/ticket-guild`);

module.exports = async (client) => {
    const description = {
        name: "Ticket System Extra Options",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("interactionCreate", async (interaction) => {
        try {

            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            if (!interaction.isButton()) return;
            if (!["ticket-close", "ticket-reopen", "ticket-delete", "ticket-lock", "ticket-unlock", "ticket-claim"].includes(interaction.customId)) return;

            const data2 = await Data2.findOne({
                guildID: interaction.guildId
            })

            if (interaction.member.roles.cache.has(data2.Role1) || interaction.member.roles.cache.has(data2.Role2) || interaction.member.roles.cache.has(data2.Role3)) {

                Data.findOne({
                    channelID: interaction.channel.id
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`No Data Found For This Ticket!`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    switch (interaction.customId) {
                        case "ticket-close":
                            if (data.claimed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is not claimed. So First Claim It!`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            if (data.closed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is Already Closed.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            // const CloseConfirmEmbed = new MessageEmbed()
                            //     .setDescription(`${client.allEmojis.m} Are you sure you want to close the ticket?`)
                            //     .setColor(ee.mediancolor)


                            // const Closerow = new MessageActionRow()
                            //     .addComponents(
                            //         new MessageButton()
                            //         .setLabel('Yes')
                            //         .setStyle('SUCCESS')
                            //         .setCustomId('ticket-yes-close')
                            //     )
                            //     .addComponents(
                            //         new MessageButton()
                            //         .setLabel('No')
                            //         .setStyle('DANGER')
                            //         .setCustomId('ticket-no-close')
                            //     );

                            // interaction.reply({
                            //     embeds: [CloseConfirmEmbed],
                            //     components: [Closerow]
                            // })

                            // const collector = await interaction.channel.createMessageComponentCollector({
                            //     time: 15000,
                            //     componentType: "BUTTON",
                            // })

                            // collector.on("collect", async (i) => {

                            //     if (i.customId === "ticket-yes-close") {

                            //         if (i.user.id !== interaction.user.id) return i.reply({
                            //             content: `${client.allEmojis.x} **This button is not for You.**`,
                            //             ephemeral: true
                            //         })

                            //         i.deferUpdate()
                            //         const CloseConfirmEmbed1 = new MessageEmbed()
                            //             .setDescription(`${client.allEmojis.m} Are you sure you want to close the ticket?`)
                            //             .setColor(ee.mediancolor)


                            //         const Closerow1 = new MessageActionRow()
                            //             .addComponents(
                            //                 new MessageButton()
                            //                 .setLabel('Yes')
                            //                 .setStyle('SUCCESS')
                            //                 .setCustomId('ticket-yes-close')
                            //                 .setDisabled(true)
                            //             )
                            //             .addComponents(
                            //                 new MessageButton()
                            //                 .setLabel('No')
                            //                 .setStyle('DANGER')
                            //                 .setCustomId('ticket-no-close')
                            //                 .setDisabled(true)
                            //             );

                            //         interaction.editReply({
                            //             embeds: [CloseConfirmEmbed1],
                            //             components: [Closerow1]
                            //         })

                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                closed: true
                            });

                            const CloseEmbed = new MessageEmbed()
                                .setDescription(`🔐 | Ticket Closed by <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            const CloseEmbed2 = new MessageEmbed()
                                .setDescription(`\`\`\`Support team ticket controls\`\`\``)
                                .setColor(ee.mediancolor)

                            const CloseButtons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setCustomId('ticket-reopen')
                                    .setLabel('Re-Open')
                                    .setEmoji("🔓")
                                    .setStyle('SECONDARY'),
                                    new MessageButton()
                                    .setCustomId('ticket-delete')
                                    .setEmoji("🗑️")
                                    .setLabel('Delete')
                                    .setStyle('DANGER'),
                                )

                            const Closeuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(Closeuser, {
                                SEND_MESSAGES: false,
                                VIEW_CHANNEL: false,
                                ATTACH_FILES: false,
                                READ_MESSAGE_HISTORY: false,
                            });

                            // interaction.channel.edit({
                            //         name: `closed-${data.channelIndex}`,
                            //         parent: data2.Closed_CategoryID
                            //     }),

                            interaction.reply({
                                embeds: [CloseEmbed, CloseEmbed2],
                                components: [CloseButtons]
                            })

                            // } else if (i.customId === "ticket-no-close") {

                            //     if (i.user.id !== interaction.user.id) return i.reply({
                            //         content: `${client.allEmojis.x} **This button is not for You.**`,
                            //         ephemeral: true
                            //     })
                            //     i.deferUpdate()

                            //     const CloseConfirmEmbed2 = new MessageEmbed()
                            //         .setDescription(`${client.allEmojis.m} Are you sure you want to close the ticket?`)
                            //         .setColor(ee.mediancolor)


                            //     const Closerow2 = new MessageActionRow()
                            //         .addComponents(
                            //             new MessageButton()
                            //             .setLabel('Yes')
                            //             .setStyle('SUCCESS')
                            //             .setCustomId('ticket-yes-close')
                            //             .setDisabled(true)
                            //         )
                            //         .addComponents(
                            //             new MessageButton()
                            //             .setLabel('No')
                            //             .setStyle('DANGER')
                            //             .setCustomId('ticket-no-close')
                            //             .setDisabled(true)
                            //         );
                            //     interaction.editReply({
                            //         embeds: [CloseConfirmEmbed2],
                            //         components: [Closerow2]
                            //     })
                            //     const NoEmbed = new MessageEmbed()
                            //         .setDescription(`${client.allEmojis.m} Cancelled The Close Request!`)
                            //         .setColor(ee.wrongcolor)

                            //     interaction.channel.send({
                            //         embeds: [NoEmbed]
                            //     })
                            // }
                            // })


                            // interaction.deferUpdate();
                            break;
                        case "ticket-reopen":
                            if (data.claimed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is not claimed. So First Claim It!`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            if (data.closed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is Not Closed.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                closed: false
                            });

                            const Reopenuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(Reopenuser, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true,
                                READ_MESSAGE_HISTORY: true,
                            });


                            const reopenEmbed = new MessageEmbed()
                                .setDescription(`Ticket Re-opened by <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            // interaction.channel.edit({
                            //         name: `ticket-${data.channelIndex}`,
                            //         parent: data2.CategoryID
                            //     }),

                            interaction.reply({
                                embeds: [reopenEmbed]
                            })
                            // interaction.deferUpdate();
                            break;
                        case "ticket-delete":
                            if (data.claimed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is not claimed. So First Claim It!`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            if (data.closed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is Not Closed.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Ticket will be deleted in 10 seconds!`)
                                    .setColor(ee.wrongcolor)
                                ]
                            })

                            const TranscriptUser = interaction.guild.members.cache.get(data.userID)

                            const channel = interaction.channel;
                            const attachment = await discordTranscripts.createTranscript(channel, {
                                limit: -1,
                                returnBuffer: false,
                                fileName: `ticket-${TranscriptUser.id}.html`
                            });

                            const TranscriptClimedByUser = interaction.guild.members.cache.get(data.claimedBy)

                            const transcriptSendEmbed = new MessageEmbed()
                                .setAuthor(TranscriptUser.user.tag, TranscriptUser.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setTitle(`📄 Ticket Transcript`)
                                .setColor(ee.color)
                                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                                .addFields([{
                                        name: "Ticket ID",
                                        value: `${data.channelIndex}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Open Time",
                                        value: `<t:${data.OpenTime}:R>`,
                                        inline: true,
                                    },
                                    {
                                        name: "Opened By",
                                        value: `<@${data.userID}>`,
                                        inline: true,
                                    },
                                    {
                                        name: "Claimed By",
                                        value: `<@${data.claimedBy}>`,
                                        inline: true,
                                    },
                                    {
                                        name: "Closed Time",
                                        value: `<t:${parseInt(Date.now() / 1000)}:R>`,
                                        inline: true,
                                    },
                                    {
                                        name: "Closed By",
                                        value: `<@${interaction.user.id}>`,
                                        inline: true,
                                    },
                                ])

                            const transcriptChannel = interaction.guild.channels.cache.get(data2.Transcript);
                            transcriptChannel.send({
                                embeds: [transcriptSendEmbed],
                                files: [attachment]
                            }).catch(err => console.log("unable to sent transcript to channel maybe chanel got deleted!"));

                            TranscriptUser.send({
                                embeds: [transcriptSendEmbed],
                                files: [attachment]
                            }).catch(err => console.log("unable to dm transcript"))

                            await Data.findOneAndDelete({
                                channelID: interaction.channel.id
                            });

                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 10 * 1000)
                            //interaction.deferUpdate();
                            break;
                        case "ticket-lock":
                            if (data.claimed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is not claimed. So First Claim It!`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            if (data.closed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is closed so you cannot lock.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            if (data.locked == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is Already Locked.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                locked: true
                            });

                            const Lockuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(Lockuser, {
                                SEND_MESSAGES: false,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: false,
                                READ_MESSAGE_HISTORY: true,
                            });

                            const lockEmbed = new MessageEmbed()
                                .setDescription(`Ticket Locked by <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)

                            const lockEmbed2 = new MessageEmbed()
                                .setDescription(`\`\`\`Support team ticket controls\`\`\``)
                                .setColor(ee.mediancolor)

                            const lockButtons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setCustomId('ticket-unlock')
                                    .setLabel('Unlock')
                                    .setEmoji("🔓")
                                    .setStyle('SECONDARY'),
                                )

                            interaction.reply({
                                embeds: [lockEmbed, lockEmbed2],
                                components: [lockButtons]
                            })

                            // interaction.deferUpdate();
                            break;
                        case "ticket-unlock":
                            if (data.claimed == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is not claimed. So First Claim It!`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            if (data.closed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is closed so you cannot unlock.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            if (data.locked == false) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`This Ticket is Not Locked.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })

                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                locked: false
                            });

                            const UnLockuser = interaction.guild.members.cache.get(data.userID)
                            interaction.channel.permissionOverwrites.edit(UnLockuser, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true,
                                READ_MESSAGE_HISTORY: true,
                            });

                            const UnlockedEmbed = new MessageEmbed()
                                .setDescription(`Ticket UnLocked by <@${interaction.user.id}>`)
                                .setColor(ee.wrongcolor)


                            interaction.reply({
                                embeds: [UnlockedEmbed]
                            })
                            // interaction.deferUpdate();
                            break;
                        case "ticket-claim":
                            if (data.claimed == true) return interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setDescription(`This Ticket is Already Claimed by <@${data.claimedBy}>.`)
                                    .setColor(ee.wrongcolor)
                                ],
                                ephemeral: true
                            })
                            await Data.updateOne({
                                channelID: interaction.channel.id
                            }, {
                                claimed: true,
                                claimedBy: interaction.user.id
                            });

                            const ClaimedEmbed = new MessageEmbed()
                                .setDescription(`Ticket is Now Claimed by <@${interaction.user.id}>`)
                                .setColor(ee.color)

                            interaction.channel.edit({
                                    name: `📂-t-${data.channelIndex}-${interaction.user.username}`,
                                }),

                                interaction.reply({
                                    embeds: [ClaimedEmbed]
                                })

                            // interaction.deferUpdate();
                            break;
                    }
                })

            } else {
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to touch these buttons!**`)
                        .setColor(ee.wrongcolor)
                    ],
                    ephemeral: true
                })
            }


        } catch (err) {
            console.log(err)
        }
    })
}