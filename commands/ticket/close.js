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
    name: 'ticket-close',
    aliases: ["t-close"],
    usage: '',
    description: 'Close the Ticket',
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
                            .setTitle(`This Ticket is Already Closed.`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    await Data.updateOne({
                        channelID: message.channel.id
                    }, {
                        closed: true
                    });

                    const CloseEmbed = new MessageEmbed()
                        .setDescription(`🔐 | Ticket Closed by <@${message.author.id}>`)
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

                    const Closeuser = message.guild.members.cache.get(data.userID)
                    message.channel.permissionOverwrites.edit(Closeuser, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: false,
                    });

                    message.reply({
                        embeds: [CloseEmbed, CloseEmbed2],
                        components: [CloseButtons]
                    })

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