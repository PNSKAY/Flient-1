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
    name: 'lock-ticket',
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

                    if (data.closed == true) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is closed so you cannot lock.`)
                            .setColor("#FFD700")
                        ],
                        ephemeral: true
                    })
                    if (data.locked == true) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`This Ticket is Already Locked.`)
                            .setColor("#FFD700")
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
                        .setColor("#FFD700")

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

                })

            } else {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}lock\` command!**`)
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