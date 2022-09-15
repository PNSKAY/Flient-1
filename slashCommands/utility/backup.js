const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const backup = require("discord-backup")
backup.setStorageFolder(__dirname + "/../../databases/serverBackups/");

module.exports = {
    name: 'backup',
    usage: '',
    description: 'Create Backup for your Server!',
    category: "utility",
    userPermissions: "ADMINISTRATOR",
    botPermissions: "ADMINISTRATOR",
    ownerOnly: false,
    toggleOff: false,
    options: [{
            name: 'create',
            type: 'SUB_COMMAND',
            description: 'Create Backup',
        },
        {
            name: 'info',
            type: 'SUB_COMMAND',
            description: 'Get a Info About a Backup Id',
            options: [{
                name: 'backup-id',
                type: 'STRING',
                description: 'The backup id you want info about',
                required: true,
            }]
        },
        {
            name: 'list',
            type: 'SUB_COMMAND',
            description: 'Get a list of a Backup Id',
            options: [{
                name: 'server-id',
                type: 'STRING',
                description: 'To see a list of backup of the server',
                required: false,
            }]
        },
        {
            name: 'load',
            type: 'SUB_COMMAND',
            description: 'Load your Backup',
            options: [{
                name: 'backup-id',
                type: 'STRING',
                description: 'The backup id you want to load',
                required: true,
            }]
        },
        {
            name: 'delete',
            type: 'SUB_COMMAND',
            description: 'Delete a Backup',
            options: [{
                name: 'backup-id',
                type: 'STRING',
                description: 'The backup id you want to delete',
                required: true,
            }]
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        const SubCommand = interaction.options.getSubcommand();;

        if (SubCommand === "create") {
            const ConfirmEmbed = new MessageEmbed()
                .setDescription(`${client.allEmojis.m} Are you sure you want to create a backup!?`)
                .setColor("#FFD700")


            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel('Yes')
                    .setStyle('SUCCESS')
                    .setCustomId('backup-yes-create')
                )
                .addComponents(
                    new MessageButton()
                    .setLabel('No')
                    .setStyle('DANGER')
                    .setCustomId('backup-no-create')
                );

            interaction.reply({
                embeds: [ConfirmEmbed],
                components: [row]
            })

            const collector = await interaction.channel.createMessageComponentCollector({
                time: 15000,
                componentType: "BUTTON",
            })

            collector.on("collect", async (i) => {

                if (i.customId === "backup-yes-create") {

                    if (i.user.id !== interaction.user.id) return i.reply({
                        content: `${client.allEmojis.x} **This button is not for You.**`,
                        ephemeral: true
                    })

                    i.deferUpdate()
                    const ConfirmEmbed1 = new MessageEmbed()
                        .setDescription(`${client.allEmojis.m} Are you sure you want to create a backup!?`)
                        .setColor("#FFD700")


                    const row1 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setLabel('Yes')
                            .setStyle('SUCCESS')
                            .setCustomId('backup-yes-create')
                            .setDisabled(true)
                        )
                        .addComponents(
                            new MessageButton()
                            .setLabel('No')
                            .setStyle('DANGER')
                            .setCustomId('backup-no-create')
                            .setDisabled(true)
                        );
                    interaction.editReply({
                        embeds: [ConfirmEmbed1],
                        components: [row1]
                    })

                    backup.create(interaction.guild, {
                        maxMessagesPerChannel: 0,
                        // jsonSave: false,
                        jsonBeautify: true,
                        // doNotBackup: [],
                        saveImages: "base64"
                    }).then((backupData) => {
                        let guildicon = interaction.guild.iconURL({
                            dynamic: true
                        });
                        let datacreated = new MessageEmbed()
                            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(`${client.allEmojis.y} New Backup Created\n> **Backup ID**: \`${backupData.id}\`\n> **Guild Name**: ${interaction.guild.name}`)
                            .setColor("#FFD700")

                        interaction.user.send({
                            embeds: [datacreated]
                        });
                        let created = new MessageEmbed()
                            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(`${client.allEmojis.y} Backup Has Been Created, Check your **DM**!`)
                            .setColor("#FFD700")


                        interaction.channel.send({
                            embeds: [created]
                        });
                    });

                } else if (i.customId === "backup-no-create") {

                    if (i.user.id !== interaction.user.id) return i.reply({
                        content: `${client.allEmojis.x} **This button is not for You.**`,
                        ephemeral: true
                    })
                    i.deferUpdate()
                    const ConfirmEmbed2 = new MessageEmbed()
                        .setDescription(`${client.allEmojis.m} Are you sure you want to create a backup!?`)
                        .setColor("#FFD700")


                    const row2 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setLabel('Yes')
                            .setStyle('SUCCESS')
                            .setCustomId('backup-yes-create')
                            .setDisabled(true)
                        )
                        .addComponents(
                            new MessageButton()
                            .setLabel('No')
                            .setStyle('DANGER')
                            .setCustomId('backup-no-create')
                            .setDisabled(true)
                        );
                    interaction.editReply({
                        embeds: [ConfirmEmbed2],
                        components: [row2]
                    })
                    const NoEmbed = new MessageEmbed()
                        .setDescription(`${client.allEmojis.m} Cancelled The Backup!`)
                        .setColor("#FFD700")

                    interaction.channel.send({
                        embeds: [NoEmbed]
                    })
                }
            })


        } else if (SubCommand === "info") {
            let backupID = interaction.options.getString("backup-id");
            if (!backupID) {
                let notvaild = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL)
                    .setDescription(`>>> ${client.allEmojis.x} You must specify a valid backup ID `)
                    .setColor("#FFD700")

                return interaction.reply({
                    embeds: [notvaild]
                });
            }
            backup.fetch(backupID).then((backupInfos) => {
                const date = new Date(backupInfos.data.createdTimestamp);
                const yyyy = date.getFullYear().toString(),
                    mm = (date.getMonth() + 1).toString(),
                    dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`;
                let backups = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL)
                    .setColor("#FFD700")
                    .addField(`${client.allEmojis.m} **Backup Info**`, `>>> Backup ID: \`${backupInfos.id}\`
                    Server ID: \`${backupInfos.data.guildID}\`
                    Backup Size: \`${backupInfos.size} kB\`
                    Backup Created At: \`${formatedDate}\``)

                interaction.reply({
                    embeds: [backups]
                })
            }).catch((err) => {
                let nobackupfound = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL)
                    .setDescription(`>>> ${client.allEmojis.x} No Backup Found For: \`${backupID}\`!`)
                    .setColor("#FFD700")

                interaction.reply({
                    embeds: [nobackupfound]
                })
            });

        } else if (SubCommand === "load") {
            // =====================================================================================
            const backupID = interaction.options.getString('backup-id')
            backup.fetch(backupID).then(async () => {

                const eConfirmEmbed = new MessageEmbed()
                    .setDescription(`${client.allEmojis.m} Are you sure you want to load the back!?\nThis will delete all channels, roles, messages, emojis, bans etc.`)
                    .setColor("#FFD700")


                const erow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setLabel('Yes')
                        .setStyle('SUCCESS')
                        .setCustomId('backup-yes-load')
                    )
                    .addComponents(
                        new MessageButton()
                        .setLabel('No')
                        .setStyle('DANGER')
                        .setCustomId('backup-no-load')
                    );

                interaction.reply({
                    embeds: [eConfirmEmbed],
                    components: [erow]
                })

                const collector = await interaction.channel.createMessageComponentCollector({
                    time: 15000,
                    componentType: "BUTTON",
                })

                collector.on("collect", async (i) => {

                    if (i.customId === "backup-yes-load") {

                        if (i.user.id !== interaction.user.id) return i.reply({
                            content: `${client.allEmojis.x} Don't touch other people's button`,
                            ephemeral: true
                        })

                        i.deferUpdate()
                        backup.load(backupID, interaction.guild, {
                            clearGuildBeforeRestore: true
                        }).then(() => {}).catch((err) => {
                            let permissionserorr = new MessageEmbed()
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setDescription(`There are 2 possible reasons for this message:\n> 1. I dont have ADMINISTRATOR Permissions\n> 2. I have completed the backup successfully!\n\nIf it is none of them please report this!`)
                                .setColor("#FFD700")

                            interaction.user.send({
                                embeds: [permissionserorr]
                            })
                        });

                    } else if (i.customId === "backup-no-load") {

                        if (i.user.id !== interaction.user.id) return i.reply({
                            content: `${client.allEmojis.m} Don't touch other people's button`,
                            ephemeral: true
                        })
                        i.deferUpdate()
                        const ConfirmEmbed2 = new MessageEmbed()
                            .setDescription(`${client.allEmojis.m} Are you sure you want to create a backup!?`)
                            .setColor("#FFD700")


                        const row2 = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setLabel('Yes')
                                .setStyle('SUCCESS')
                                .setCustomId('backup-no-load')
                                .setDisabled(true)
                            )
                            .addComponents(
                                new MessageButton()
                                .setLabel('No')
                                .setStyle('DANGER')
                                .setCustomId('backup-yes-load')
                                .setDisabled(true)
                            );
                        interaction.editReply({
                            embeds: [ConfirmEmbed2],
                            components: [row2]
                        })
                        const NoEmbed = new MessageEmbed()
                            .setDescription(`${client.allEmojis.x} Cancelled The Backup!`)
                            .setColor("#FFD700")

                        interaction.channel.send({
                            embeds: [NoEmbed]
                        })
                    }
                })
            }).catch((err) => {
                let nobackupfound = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`${client.allEmojis.m} No backup found for ${backupID}`)
                    .setColor("#FFD700")

                interaction.reply({
                    embeds: [nobackupfound]
                })
            });



        } else if (SubCommand === "delete") {
            let backupID = interaction.options.getString("backup-id");
            if (!backupID) {
                let notvaild = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`${client.allEmojis.m} You must specify a valid backup ID To Remove`)

                    .setColor("#FFD700")

                interaction.reply({
                    embeds: [notvaild]
                })
            }
            backup.fetch(backupID).then((backupInfos) => {
                backup.remove(backupID)
                let backups = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`${client.allEmojis.x} Backup Deleted!`)
                    .setColor("#FFD700")

                interaction.reply({
                    embeds: [backups]
                })
            }).catch((err) => {
                let nobackupfound = new MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`${client.allEmojis.x} No backup found!`)
                    .setColor("#FFD700")

                interaction.reply({
                    embeds: [nobackupfound]
                })
            });

        } else if (SubCommand === "list") {
            let guildID = interaction.options.getString("server-id");

            if (guildID) {
                try {
                    let guild = await client.guilds.cache.get(guildID);
                    if (!guild) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.x} Enter a Valid Server ID`)
                            .setColor("#FFD700")
                        ]
                    })
                    backup.list(guild).then((backups) => {
                        let lists = new MessageEmbed()
                            .setTitle(`${client.allEmojis.y} BACKUPS OF: ` + String(guild.name).toUpperCase())
                            .setColor("#FFD700")
                            .setDescription(`${backups.map((backup, id) => `\n**${id + 1}**) \`${backup}\``)}`)

                        return interaction.reply({
                            embeds: [lists]
                        })
                    })
                } catch {
                    return interaction.reply({
                        content: `${client.allEmojis.x} **NO BACKUP FOUND FOR THIS SERVER ID**`,
                        ephemeral: true
                    })
                }

            } else {
                backup.list(interaction.guild).then((backups) => {
                    let lists2 = new MessageEmbed()
                        .setTitle(`${client.allEmojis.y} BACKUPS OF THIS SERVER!`)
                        .setColor("#FFD700")
                        .setDescription(`${backups.map((backup, id) => `\n**${id + 1}**) \`${backup}\``)}`)
                    interaction.reply({
                        embeds: [lists2]
                    })
                })
            }

        }

    }
}