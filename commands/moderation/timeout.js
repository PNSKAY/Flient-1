const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: 'timeout',
    aliases: [],
    usage: "[@user] [reason]",
    description: 'Set a member to timeout.',
    cooldown: 0,
    userPermissions: "MODERATE_MEMBERS",
    botPermissions: "MODERATE_MEMBERS",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee) {
        try {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const duration = args[1];
            let reason = args.slice(2).join(" ");

            if (!args[0]) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.mediancolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`${client.allEmojis.m} Please mention the member you want to timout.`)
                ]
            });

            if (!duration) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} Please specify a time for the timeout`)
                ]
            });

            if (!reason) reason = 'No reason given.';

            if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`${client.allEmojis.x} You cannot timeout this user as thier role is the same or higher then yours.`)
                ]
            });

            const timeToMs = ms(duration);
            if (!timeToMs) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} Please specify a valid time!`)
                ]
            });

            member.timeout(timeToMs, reason);
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setAuthor(`Successfully Timeout-ed`, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`>>> ${member} has been timeout-ed for \`${duration}\`\n**Reason:** ${reason}`)
                ]
            });


        } catch (e) {
            console.log(e)
        }
    }
}