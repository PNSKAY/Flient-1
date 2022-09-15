const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed
} = require("discord.js");
const Discord = require("discord.js");
const {
    databasing
} = require(`${process.cwd()}/structures/handlers/functions`);

module.exports = async (client) => {
    const description = {
        name: "MenuRole",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("interactionCreate", async (interaction) => {
        try {

            databasing(client, interaction.guildId)
            const guild_settings = client.settings.get(interaction.guildId);
    
            let ee = guild_settings.embed;
    
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;
    
            if (interaction.isSelectMenu()) {
                if (interaction.customId !== "reaction-roles") return;
                const roleId = interaction.values[0];
                const role = interaction.guild.roles.cache.get(roleId);
                const memberRoles = interaction.member.roles;
                const hasRole = memberRoles.cache.has(roleId);
                if (hasRole) {
                    memberRoles.remove(roleId);
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${client.allEmojis.x} ${role} has been removed from you`)
                        ],
                        ephemeral: true
                    })
                } else {
                    memberRoles.add(roleId);
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setDescription(`${client.allEmojis.y} ${role} has been added to you`)
                        ],
                        ephemeral: true
                    })
                }
            }
    
        } catch (err) {
            console.log(err)
        }
    })

}


/**
 * @INFO
 * Bot Coded by Zedro#2742 | https://discord.gg/8fYUFxMtAq
 * @INFO
 * Work for Milanio Development | https://discord.gg/8fYUFxMtAq
 * @INFO
 * Please Mention Us Milanio Development, When Using This Code!
 * @INFO
 */