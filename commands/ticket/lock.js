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

module.exports = {
    name: 'ticket-lock',
    aliases: ["t-lock"],
    usage: '',
    description: 'Lock the Ticket',
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

                    if (data.closed == true) return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is closed so you cannot lock.`)
                            .setColor(ee.wrongcolor)
                        ]
                    })
                    if (data.locked == true) return message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is Already Locked.`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    await Data.updateOne({
                        channelID: message.channel.id
                    }, {
                        locked: true
                    });

                    const Lockuser = message.guild.members.cache.get(data.userID)
                    message.channel.permissionOverwrites.edit(Lockuser, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: true,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: true,
                    });

                    const lockEmbed = new MessageEmbed()
                        .setDescription(`Ticket Locked by <@${message.author.id}>`)
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

                    message.reply({
                        embeds: [lockEmbed, lockEmbed2],
                        components: [lockButtons]
                    })

                })

            } else {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}lock\` command!**`)
                        .setColor(ee.wrongcolor)
                    ]
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}