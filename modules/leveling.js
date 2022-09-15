const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing
} = require(`${process.cwd()}/structures/handlers/functions`);
const fetch = require('node-fetch');
const Levels = require('discord-xp');
Levels.setURL(`${config.env.MongoDB_TOKEN || process.env.MongoDB_TOKEN}`);
const lvlSchema = require(`${process.cwd()}/structures/models/levelToggleSchema`);

module.exports = async (client) => {
    const description = {
        name: "Leveling System",
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

            lvlSchema.findOne({
                guildId: message.guild.id
            }, async (e, data) => {
                if (!data) {
                    new lvlSchema({
                        guildId: message.guild.id,
                        toggle: 1,
                    }).save();
                    return;
                };

                const data2 = client.settings.get(message.guild.id, "levelupChannel");

                if (data.toggle == 1) {
                    const randomAmountOfXp = Math.floor(Math.random() * 19) + 1;
                    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
                    if (hasLeveledUp) {
                        const user = await Levels.fetch(message.author.id, message.guild.id);
                        const channel = message.guild.channels.cache.get(data2);
                        if (channel) {
                                return channel.send({
                                    content: `Congratulations ${message.member}! You have leveled up to **LEVEL ${user.level}** ! <a:Squirtle_cool:943530227815030844>`
                                }).catch(() => {});
                            } else {
                                return message.channel.send({
                                    content: `Congratulations ${message.member}! You have leveled up to **LEVEL ${user.level}** ! <a:Squirtle_cool:943530227815030844>`
                                }).catch(() => {});
                            }
                    }
                } else if (data.toggle == 0) {

                }
                if (!data2) return;
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