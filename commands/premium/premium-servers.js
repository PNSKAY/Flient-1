const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const moment = require("moment");
const Servers = require(`${process.cwd()}/structures/models/premium-server`);

module.exports = {
    name: "premium-servers",
    aliases: [],
    usage: '',
    description: "",
    category: "ownerOnly",
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

            if (!message.member.roles.cache.has(client.premiumActivator)) return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.x} Premium System`)
                    .setDescription(`You don't have permission to use these commands!`)
                    .setColor(ee.wrongcolor)
                ]
            })

            let data = client.premiumServers.filter((data) => data.isPremium === true).map((data, index) => {
                const serverid = client.guilds.cache.get(data.Id);
                return `**${guilds.id.name}**\n**Expire At:** \`${moment(data.premium.expiresAt).format("dddd, MMMM Do YYYY")}\` **Plan:** \`${data.premium.plan}\``;
            });

            return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`${client.allEmojis.y} Premium System`)
                    .setDescription(data.join("\n\n").substr(0, 4000) || "No Premium Servers Found")
                    .setColor(ee.color)
                ],
            });
        } catch (e) {
            console.log(e)
        }
    },
};