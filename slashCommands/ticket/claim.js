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
    name: 'claim-ticket',
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

                    if (data.claimed == true) return message.reply({
                        embeds: [new MessageEmbed()
                            .setDescription(`This Ticket is Already Claimed by <@${data.claimedBy}>.`)
                            .setColor("#FFD700")
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
                        .setColor("#FFD700")

                    interaction.channel.edit({
                            name: `📂-t-${data.channelIndex}-${interaction.user.username}`,
                        }),

                        interaction.reply({
                            embeds: [ClaimedEmbed]
                        })

                })

            } else {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}claim\` command!**`)
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