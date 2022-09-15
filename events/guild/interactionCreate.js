const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
	Client,
	CommandInteraction,
	MessageEmbed
} = require("discord.js");
const Discord = require("discord.js");
const {
	databasing,
	onCoolDown,
} = require(`${process.cwd()}/structures/handlers/functions`);
const premiumServerModel = require(`${process.cwd()}/structures/models/premium-server`);

module.exports = {
	name: "interactionCreate",

	/**
	 * @param {Client} client 
	 * @param {CommandInteraction} interaction
	 */

	async execute(client, interaction) {
		try {

			databasing(client, interaction.guild.id)
            const guild_settings = client.settings.get(interaction.guild.id);

            let ee = guild_settings.embed;

            let {
                prefix
            } = guild_settings;

			if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
			if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
				return interaction.reply({
					content: `❌ I am missing the Permission to \`USE_EXTERNAL_EMOJIS\``,
					ephemeral: true
				})
			if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS))
				return interaction.reply({
					content: `${client.allEmojis.x} I am missing the Permission to \`EMBED_LINKS\``,
					ephemeral: true
				})
			if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS))
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setTitle(`${client.allEmojis.x} I am missing the Permission to \`ADD_REACTIONS\``)
					],
					ephemeral: true
				})

			if (interaction.isCommand()) {
				const command = client.slashCommands.get(interaction.commandName);
				if (!command) return client.slashCommands.delete(interaction.commandName);

				if (command) {

					const args = [];

					for (let option of interaction.options.data) {
						if (option.type === "SUB_COMMAND") {
							if (option.name) args.push(option.name);
							option.options?.forEach((x) => {
								if (x.value) args.push(x.value);
							})
						} else if (option.value) args.push(option.value);
					}

                    let premiumServer = client.premiumServers.get(interaction.guild.id);
                    if (!premiumServer) {
                        const findPremiumServer = await premiumServerModel.findOne({
                            Id: interaction.guild.id
                        });
                        if (!findPremiumServer) {
                            const newPremiumServer = await premiumServerModel.create({
                                Id: interaction.guild.id
                            });
                            client.premiumServers.set(interaction.guild.id, newPremiumServer);
                            premiumServer = newPremiumServer;
                        };
                    }

                    if (command.premium && premiumServer && !premiumServer.isPremium) {
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`${client.allEmojis.x} Premium Commands`)
                                .setDescription(`This server is not a premium server!
                                If you are interested in buying **Premium** for your server!
                                Join **[Milanio Development](${process.env.SUPPORT})** And **Open a Ticket!**`)
                                .setColor(ee.wrongcolor)
                            ],
                            ephemeral: true
                        })
                    }

					if (command.toggleOff) {
						return await interaction.reply({
							embeds: [new MessageEmbed()
								.setTitle(`${client.allEmojis.x} **That Command Has Been Disabled By The Developers! Please Try Later.**`)
								.setColor(ee.wrongcolor)
							]
						}).catch((e) => {
							console.log(e)
						});
					}
					if (!interaction.member.permissions.has(command.userPermissions)) return await interaction.reply({
						embeds: [new MessageEmbed()
							.setDescription(`${client.allEmojis.x} **I do not have \`${command.userPermissions}\` permission to use \`${command.name}\` command!**`)
							.setColor(ee.wrongcolor)
						],
						ephemeral: true
					}).catch((e) => {
						console.log(e)
					});
					if (!interaction.guild.me.permissions.has(command.botPermissions)) return await interaction.reply({
						embeds: [new MessageEmbed()
							.setDescription(`${client.allEmojis.x} **I do not have \`${command.botPermissions}\` permission to use \`${command.name}\` command!**`)
							.setColor(ee.wrongcolor)
						],
						ephemeral: true
					}).catch((e) => {
						console.log(e)
					});
					if (onCoolDown(interaction, command)) {
						return await interaction.reply({
							embeds: [new MessageEmbed()
								.setColor(ee.wrongcolor)
								.setDescription(`${client.allEmojis.x} **Please wait \`${onCoolDown(interaction, command).toFixed(1)} seconds\` Before using the \`${command.name}\` command again!.**`)
							],
							ephemeral: true
						});
					}
					command.execute(client, interaction, args, ee, prefix);
                    const commandLogsChannel = client.channels.cache.get(config.botlogs.commandLogsChannel);
                    if (!commandLogsChannel) return;
                commandLogsChannel.send({
                    embeds: [new MessageEmbed()
                        //.setColor(ee.color)
                        .setAuthor(interaction.guild.name, interaction.guild.iconURL({
                            dynamic: true
                        }))
                        .setTitle(`<:1arrow:947486804397924392> Slash Command`)
                        .addField("**<:1arrow:947486804397924392> Author**", `\`\`\`${interaction.user.tag}\`\`\``)
                        .addField("**<:1arrow:947486804397924392> Command Name**", `\`\`\`${command.name}\`\`\``)
                    ]
                });
				}
			}

		} catch (e) {
			console.log(e)
			return interaction.channel.send({
				embeds: [new MessageEmbed()
					//.setColor(ee.wrongcolor)
					.setTitle(`${client.allEmojis.x} ERROR | An error occurred`)
					//.setFooter(ee.footertext, ee.footericon)
					.setDescription(`\`\`\`${e.message}\`\`\``)
				]
			});
		}
	}
}