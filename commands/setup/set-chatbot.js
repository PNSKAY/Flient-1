const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const Schema = require(`${process.cwd()}/structures/models/chatbot`);

module.exports = {
    name: 'set-chatbot',
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

    async execute(client, message, args, ee, prefix) {
        try {
            const channel = message.mentions.channels.first();

            if (!channel) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.m} ChatBot System`)
                    .setColor(ee.mediancolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`Please mention a channel to set the chatbot!`)
                ]
            });

            Schema.findOne({
                Guild: message.guild.id
            }, async (err, data) => {
                if (data) {
                    data.Channel = channel.id,
                        data.save();
                } else {
                    new Schema({
                        Guild: message.guild.id,
                        Channel: channel.id,
                    }).save();
                }
                message.reply({
                    embeds: [new MessageEmbed()
                        .setTitle(`${client.allEmojis.y} ChatBot System`)
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setDescription(`${channel} has been set as the **ChatBot Channel**`)
                    ]
                });
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
            if (!errorLogsChannel) return;
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