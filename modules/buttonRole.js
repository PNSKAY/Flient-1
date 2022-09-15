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
        name: "ButtonRole",
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
    
            if (interaction.isButton()) {
                //if (interaction.customId !== "button-role1") return;
                const roleId = interaction.customId;
                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${client.allEmojis.x} That Role Does Not Exist`)
                    ],
                    ephemeral: true
                })
                if (role.position > interaction.guild.me.roles.highest.position) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${client.allEmojis.x} I cannot add this roles as this role is the same or higher then mine.`)
                    ],
                    ephemeral: true
                })
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
    });
    
};