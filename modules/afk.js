const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const DB = require(`${process.cwd()}/structures/models/afk`);

module.exports = async (client) => {
    const description = {
        name: "AFK System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("messageCreate", async (message) => {
        try {
            if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
            if (message.author.bot) return;
    
            databasing(client, message.guild.id)
            embedDatabasing(client, message.guild.id)
            
            const guild_settings = client.settings.get(message.guild.id);
            const guild_settings2 = client.embedSettings.get(message.guild.id);

            let ee = guild_settings2.embed;
    
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;
    
            if (message.mentions.members.size) {
                const Embed = new MessageEmbed()
                    .setColor(ee.wrongcolor)
    
                message.mentions.members.forEach((m) => {
                    DB.findOne({
                        // GuildID: message.guild.id,
                        UserID: m.id
                    }, async (err, data) => {
                        if (err) throw err;
                        if (data) {
                            // message.delete();
                            const Embed = new MessageEmbed()
                                .setAuthor(message.author.tag, message.author.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setColor(ee.wrongcolor)
                                .setDescription(`>>> **${m.user.tag}** went **AFK** <a:Muted:906789339894272010> <t:${data.Time}:R>\n**Status**: ${data.Status}`);
                            return message.channel.send({
                                embeds: [Embed]
                            });
                        } else {
                            return;
                        }
                    })
                })
            }
    
        } catch (e) {
            console.log(e)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    //.setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} ERROR | An error occurred`)
                    //.setFooter(ee.footertext, ee.footericon)
                    .setDescription(`\`\`\`${e.message}\`\`\``)
                ]
            });
        }
    });
    
};