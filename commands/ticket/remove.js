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
    name: 'ticket-remove',
    aliases: ["t-remove"],
    usage: '',
    description: 'Remove User From the Ticket',
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

                    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

                    if (!user) return message.reply({
                        embeds: [new MessageEmbed()
                            .setDescription(`Please Mention the Member You Want to Remove form the ticket!`)
                            .setColor(ee.wrongcolor)
                        ]
                    })

                    message.channel.permissionOverwrites.edit(user, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: false,
                    });

                    const Embed = new MessageEmbed()
                        .setDescription(`Successfuly Removed ${user} from Ticket!`)
                        .setColor(ee.color)

                    message.reply({
                        embeds: [Embed]
                    })

                })

            } else {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}remove\` command!**`)
                        .setColor(ee.wrongcolor)
                    ]
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}