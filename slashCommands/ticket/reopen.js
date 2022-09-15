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

module.exports = {
    name: 'reopen-ticket',
    usage: '',
    description: 'Re-Open the Ticket',
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
                        .setColor("#FFD700")

                    interaction.reply({
                        embeds: [reopenEmbed]
                    })

                })

            } else {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}reopen\` command!**`)
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