const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const roleData = require(`${process.cwd()}/structures/models/autorole`)

module.exports = {
    name: 'remove-autorole',
    aliases: [],
    usage: '',
    description: '',
    category: "setup",
    cooldown: 0,
    userPermissions: "ADMINISTRATOR",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee) {
        try {
            roleData.findOne({
                GuildID: message.guild.id,
            }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    await roleData.findOneAndDelete({
                        GuildID: message.guild.id
                    })
                    message.channel.send({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.y} AutoRole System`)
                            .setDescription(`**AutoRole** has been stopped!`)
                            .setColor(ee.color)
                        ]
                    })
                } else {
                    message.channel.send({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.x} AutoRole System`)
                            .setDescription(`**AutoRole** isn't setup!`)
                            .setColor(ee.color)
                        ]
                    })
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
            return errorLogsChannel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.guild.name, message.guild.iconURL({
                        dynamic: true
                    }))
                    .setTitle(`${client.allEmojis.x} Got a Error:`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
                    .setFooter(`Having: ${message.guild.memberCount} Users`)
                ]
            })
        }

    }
}