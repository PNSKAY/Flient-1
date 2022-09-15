const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    MessageButton
} = require('discord.js');
const eec = require(`${process.cwd()}/structures/botconfig/embed.json`);

module.exports = {
    name: "owner-help",
    aliases: ['o-help'],
    usage: '',
    description: "",
    category: "ownerOnly",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: true,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee) {

        try {
            message.reply({
                embeds: [new MessageEmbed()
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setColor(ee.color)
                    .setAuthor(`${client.user.username} Owner Help Menu`, client.user.displayAvatarURL())
                    .addFields({
                        name: `🔰┃Commands`,
                        value: `${client.commands.filter((cmd) => cmd.category === "ownerOnly").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`
                    })
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
            return errorLogsChannel.send({
                embeds: [new MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({
                        dynamic: true
                    }))
                    .setColor("RED")
                    .setTitle(`${client.allEmojis.x} Got a Error:`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
                    .setFooter(`Having: ${message.guild.memberCount} Users`)
                ]
            })
        }
    }
}