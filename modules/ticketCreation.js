const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const ee = require(`${process.cwd()}/structures/botconfig/embed.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const Discord = require("discord.js");
const Data = require(`${process.cwd()}/structures/models/ticket-user`);
const Data2 = require(`${process.cwd()}/structures/models/ticket-guild`);

module.exports = function (client, options) {
    const description = {
        name: "Ticket Creation System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("interactionCreate", async (interaction) => {
        try {

            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return;

            if (!interaction.isButton()) return;
            if (!["ticket-create"].includes(interaction.customId)) return;

            const data2 = await Data2.findOne({
                guildID: interaction.guildId
            })

            // if (!data2) {
            //     new Data2({
            //         guildID: interaction.guild.id,
            //         index: 0
            //     }).save()
            // }
            let a = data2.index;
            let b = ++a;

            switch (interaction.customId) {
                case "ticket-create":
                    await interaction.guild.channels.create(`⏰-t-${data2.index + 1}-${interaction.user.username}`, {
                        type: 'GUILD_TEXT',
                        parent: data2.CategoryID,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: data2.Role1,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: data2.Role2,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: data2.Role3,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                        }, {
                            id: interaction.guild.id,
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }],
                    }).then(async (channel) => {
                        await Data.create({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            channelID: channel.id,
                            channelIndex: b,
                            closed: false,
                            locked: false,
                            claimed: false,
                            OpenTime: parseInt(channel.createdTimestamp / 1000),
                        })

                        await data2.updateOne({
                            index: b
                        });

                        const WelcomeEmbed = new MessageEmbed()
                            .setTitle('__**Ticket Opened!**__')
                            .setDescription(`${data2.OpenDescription.replace(/<@>/g, `${interaction.user}`)}`)
                            .setColor(ee.color)
                            .setTimestamp()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            });

                        const closeTicket = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('ticket-claim')
                                .setLabel('Claim')
                                .setEmoji("903988142347014144")
                                .setStyle('SUCCESS'),
                                new MessageButton()
                                .setCustomId('ticket-lock')
                                .setLabel('Lock')
                                .setEmoji("🔒")
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId('ticket-close')
                                .setLabel('Close')
                                .setEmoji("🔐")
                                .setStyle('DANGER'),
                            );
                        channel.send({
                            // content: `Welcome <@${interaction.user.id}>, Here is Your Ticket`,
                            embeds: [WelcomeEmbed],
                            components: [closeTicket]
                        }).then((msg) => msg.pin())

                        return interaction.reply({
                            content: `Ticket has been Created: ${channel}`,
                            ephemeral: true
                        })
                    })
                    break;
            }
        } catch (err) {
            console.log(err)
        }
    })

}