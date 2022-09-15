const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const ChatBotSchema = require(`${process.cwd()}/structures/models/chatbot`);
const fetch = require("node-fetch");

module.exports = async (client) => {
    const description = {
        name: "ChatBot System",
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

            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            ChatBotSchema.findOne({
                Guild: message.guild.id
            }, async (err, data) => {
                if (!data) return;
                if (message.channel.id !== data.Channel) return;
                try {
                    
                    await fetch(`http://api.brainshop.ai/get?bid=164044&key=EjMZ01S3OE1bPoln&uid=1&msg=${encodeURIComponent(message)}`)
                        .then((response) => {
                            response.json().then((result) => {

                                // console.log(result.message)
                                message.reply({
                                    content: result.cnt
                                })

                            })
                        })

                } catch (e) {

                    message.channel.send({
                        content: `${client.allEmojis.x} Couldn't fetch response! API Error!`
                    }).catch((e) => {})

                }

            })

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
