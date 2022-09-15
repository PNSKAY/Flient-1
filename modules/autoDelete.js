const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed,
    Permissions
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const Schema = require(`${process.cwd()}/structures/models/autodelete`);

module.exports = async (client) => {

    const description = {
        name: "AutoDelete System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("messageCreate", async (message) => {
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;

        databasing(client, message.guild.id)
        const guild_settings = client.settings.get(message.guild.id);

        let ee = guild_settings.embed;

        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

        Schema.findOne({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return;

            if (message.guild) {
                if (data.Channel == message.channel.id && message.channel.type == "GUILD_TEXT") {
                    setTimeout(() => {
                        try {

                            if (!message.deleted) {
                                if (message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                                    message.delete().catch(() => {
                                        //Try a second time
                                        setTimeout(() => {
                                            message.delete().catch(() => {})
                                        }, 1500)
                                    })
                                } else {
                                    return;
                                }
                            }

                        } catch (e) {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey);
                        }
                    }, data.Delay)
                }
            }

        })

    })

}