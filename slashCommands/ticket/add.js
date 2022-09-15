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
    name: 'add-user-to-ticket',
    usage: '',
    description: 'Add User to the Ticket',
    category: "ticket",
    cooldown: 5,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
        name: "user",
        description: "Mention the user you want to add in the Ticket!",
        type: "USER",
        required: true
    }],

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

                    let user = interaction.options.getUser("user");

                    // if (data.userID.includes(user.id)) return interaction.reply({
                    //     embeds: [new MessageEmbed()
                    //         .setTitle(`This Member is already added to the Ticket!`)
                    //         .setColor("#FFD700")
                    //     ]
                    // })
                    // data.userID.push(user.id);

                    interaction.channel.permissionOverwrites.edit(user, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        ATTACH_FILES: true,
                        READ_MESSAGE_HISTORY: true,
                    });

                    const Embed = new MessageEmbed()
                        .setDescription(`Added ${user} to the Ticket!`)
                        .setColor("#FFD700")

                    interaction.reply({
                        embeds: [Embed]
                    })

                })
            } else {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`${client.allEmojis.x} **You do not have required roles to use \`${prefix}add\` command!**`)
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