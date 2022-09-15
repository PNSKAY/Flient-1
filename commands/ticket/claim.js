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
    name: 'ticket-claim',
    aliases: ["t-claim"],
    usage: '',
    description: 'Claim the Ticket',
    category: "ticket",
    cooldown: 5,
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

                    if (data.claimed == true) return message.reply({
                        embeds: [new MessageEmbed()
                            .setDescription(`This Ticket is Already Claimed by <@${data.claimedBy}>.`)
                            .setColor(ee.wrongcolor)
                        ]
                    })
                    await Data.updateOne({
                        channelID: message.channel.id
                    }, {
                        claimed: true,
                        claimedBy: message.author.id
                    });

                    const ClaimedEmbed = new MessageEmbed()
                        .setDescription(`Ticket is Now Claimed by <@${message.author.id}>`)
                        .setColor(ee.color)

                    message.channel.edit({
                            name: `📂-t-${data.channelIndex}-${message.author.username}`,
                        }),

                        message.reply({
                            embeds: [ClaimedEmbed]
                        })

                })

            } else {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}claim\` command!**`)
                        .setColor(ee.wrongcolor)
                    ]
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}