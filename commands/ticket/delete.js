const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Message,
    Client
} = require("discord.js");
const Data = require(`${process.cwd()}/structures/models/ticket-user`);
const Data2 = require(`${process.cwd()}/structures/models/ticket-guild`);
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: 'ticket-delete',
    aliases: ["t-delete"],
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
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee, prefix) {
        try {

            const data2 = await Data2.findOne({
                guildID: message.guild.id
            })

            if (message.member.roles.cache.has(data2.Role1) || message.member.roles.cache.has(data2.Role2) || message.member.roles.cache.has(data2.Role3)) {

                Data.findOne({
                    channelID: message.channel.id
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`No Data Found For This Ticket!`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    if (data.claimed == false) return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is not claimed. So First Claim It!`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    if (data.closed == false) return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is Not Closed.`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Ticket will be deleted in 10 seconds!`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    const TranscriptUser = message.guild.members.cache.get(data.userID)

                    const channel = message.channel;
                    const attachment = await discordTranscripts.createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `ticket-${TranscriptUser.id}.html`
                    });

                    const transcriptSendEmbed = new MessageEmbed()
                        // .setAuthor({
                        //     name: TranscriptUser.author.tag,
                        //     iconURL: TranscriptUser.author.displayAvatarURL({
                        //         dynamic: true
                        //     })
                        // })
                        .setTitle(`📄 Ticket Transcript`)
                        .setColor(ee.color)
                        .setFooter(`${message.guild.name}`, message.guild.iconURL({
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
                                value: `<@${message.author.id}>`,
                                inline: true,
                            },
                        ])

                    const transcriptChannel = message.guild.channels.cache.get(data2.Transcript);
                    transcriptChannel.send({
                        embeds: [transcriptSendEmbed],
                        files: [attachment]
                    }).catch(err => console.log("unable to sent transcript to channel maybe chanel got deleted!"));

                    TranscriptUser.send({
                        embeds: [transcriptSendEmbed],
                        files: [attachment]
                    }).catch(err => console.log("unable to dm transcript"))

                    await Data.findOneAndDelete({
                        channelID: message.channel.id
                    });

                    setTimeout(() => {
                        message.channel.delete();
                    }, 10 * 1000)

                })

            } else {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}close\` command!**`)
                        .setColor(ee.wrongcolor)
                    ]
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}