const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const {
    Color,
    isColor
} = require("coloras");

module.exports = {
    name: 'set-embed-color',
    aliases: ["set-embedcolor"],
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
        const colorc = args[0];

        if (!colorc) return message.reply({
            embeds: [new MessageEmbed()
                .setColor(ee.mediancolor)
                .setTitle(`${client.allEmojis.m} Please mention a color code in RGB, HEX, HSL, HSV, CMYK`)
            ]
        });

        if (colorc.length != 7 && !colorc.includes("#")) return message.reply({
            embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`${client.allEmojis.x} Please mention a valid color with the hex code \`#FFD700\``)
            ]
        })

        if (colorc) {
            if (!isColor(colorc).color) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} You must enter a valid color. The colour can be in RGB, HEX, HSL, HSV, CMYK.`)
                ]
            });
        }

        try {
            client.settings.set(message.guild.id, colorc, "embed.color")
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTitle(`${client.allEmojis.y} Successfully setted the embed color`)
                ]
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