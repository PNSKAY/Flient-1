const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "premium",
    aliases: ["premium-help"],
    usage: '',
    description: "",
    category: "premium",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,   
    toggleOff: false,
    premium: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee, prefix) {
        try {

            message.reply({
                embeds: [new MessageEmbed()
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setColor(ee.color)
                    .setAuthor(`Premium Features!`, client.user.displayAvatarURL())
                    .setDescription(`❓ Get a Premium For ${client.user} in Your Server!
🚀 Get Access to Advanced Features of ${client.user} with Premium!
🎖️ Join Our Server **[CrimeX Developmenet](${process.env.SUPPORT})** to Get Premium For Cheap Prize!`)]
            })

        } catch (e) {
            console.log(e)
        }
    },
};