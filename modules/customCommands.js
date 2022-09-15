const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require('discord.js');
const Discord = require("discord.js");
const {
    databasing,
    embedDatabasing,
    escapeRegex
} = require(`${process.cwd()}/structures/handlers/functions`);
const customCommandSchema = require(`${process.cwd()}/structures/models/custom-commands`);

module.exports = async (client) => {
    const description = {
        name: "CustomCommands",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("messageCreate", async (message) => {
        try {
            if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
            if (message.channel?.partial) await message.channel.fetch().catch(() => {});
            if (message.member?.partial) await message.member.fetch().catch(() => {});

            databasing(client, message.guild.id)
            embedDatabasing(client, message.guild.id)
            
            const guild_settings = client.settings.get(message.guild.id);
            const guild_settings2 = client.embedSettings.get(message.guild.id);

            let ee = guild_settings2.embed;

            let {
                prefix
            } = guild_settings;
            
            if (message.author.bot) return;

            if (prefix === null) prefix = config.env.PREFIX || process.env.PREFIX;

            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
            if (!prefixRegex.test(message.content)) return;
            const [, mPrefix] = message.content.match(prefixRegex);

            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            const args = message.content.slice(mPrefix.length).trim().split(/ +/);
            const cmd = args.shift()?.toLowerCase();

            if (cmd.length === 0) return

            const customcommands = await customCommandSchema.findOne({
                Guild: message.guild.id,
                Command: cmd
            });
            if (customcommands) message.channel.send({
                content: customcommands.Response
            });
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
