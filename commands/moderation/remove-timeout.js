const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: 'timeout-remove',
    aliases: [],
    usage: "[@user] [reason]",
    description: 'Remove a member from timeout.',
    category: "moderation",
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

            let reason = args.slice(2).join(" ");

            if (!args[0]) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.mediancolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`${client.allEmojis.m} Please mention the member you want to remove from timeout.`)
                ]
            });

            if (!reason) reason = 'No reason given.';

            if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`${client.allEmojis.x} You cannot remove this user from timeout as thier role is the same or higher then yours.`)
                ]
            });

            member.timeout(null, reason);
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setAuthor(`Successfully Removed From Timeout`, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`>>> ${member} has been Removed from timeout\n**Reason:** ${reason}`)
                ]
            });


        } catch (e) {
            console.log(e)
        }
    }
}