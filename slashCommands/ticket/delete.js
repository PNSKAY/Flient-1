const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    CommandInteraction,
    Client
} = require("discord.js");
const Data = require(`${process.cwd()}/structures/models/ticket-user`);
const Data2 = require(`${process.cwd()}/structures/models/ticket-guild`);
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: 'delete-ticket',
    usage: '',
    description: 'Delete the Ticket',
    category: "ticket",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee, prefix) {
        try {

            const data2 = await Data2.findOne({
                guildID: interaction.guild.id
            })

            if (interaction.member.roles.cache.has(data2.Role1) || interaction.member.roles.cache.has(data2.Role2) || interaction.member.roles.cache.has(data2.Role3)) {

                Data.findOne({
                    channelID: interaction.channel.id
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`No Data Found For This Ticket!`)
                            .setColor("#FFD700")
                        ],
                        ephemeral: true
                    })

                    if (data.claimed == false) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is not claimed. So First Claim It!`)
                            .setColor("#FFD700")
                        ],
                        ephemeral: true
                    })

                    if (data.closed == false) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is Not Closed.`)
                            .setColor("#FFD700")
                        ],
                        ephemeral: true
                    })

                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Ticket will be deleted in 10 seconds!`)
                            .setColor("#FFD700")
                        ]
                    })

                    const TranscriptUser = interaction.guild.members.cache.get(data.userID)

                    const channel = interaction.channel;
                    const attachment = await discordTranscripts.createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `ticket-${TranscriptUser.id}.html`
                    });

                    const transcriptSendEmbed = new MessageEmbed()
                        .setAuthor(TranscriptUser.user.tag, TranscriptUser.user.displayAvatarURL({
                            dynamic: true
                        }))
                        .setTitle(`📄 Ticket Transcript`)
                        .setColor("#FFD700")
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

                })

            } else {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}close\` command!**`)
                        .setColor("#FFD700")
                    ],
                    ephemeral: true
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}