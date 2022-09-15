const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: 'set-captcha',
    usage: '',
    description: 'Setup Captcha',
    category: "setup",
    userPermissions: "ADMINISTRATOR",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
        name: "options",
        description: "Enable / Disable Captcha System",
        type: "STRING",
        required: true,
        choices: [{
                name: "enable",
                value: "enable",
            },
            {
                name: "disable",
                value: "disable",
            },
        ]
    }, ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        const {
            options
        } = interaction;

        try {
            switch (options.getString("options")) {
                case "enable": {
                    client.captcha.set(interaction.guild.id, "captcha")
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.y} Captcha System`)
                            .setDescription(`Captcha's is now **Enabled**`)
                            .setColor("#FFD700")
                        ]
                    });
                }
                case "disable": {
                    client.captcha.delete(interaction.guild.id)
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${client.allEmojis.x} Captcha System`)
                            .setDescription(`Captcha's is now **Disabled**`)
                            .setColor("#FFD700")
                        ]
                    });
                }
            }
        } catch (e) {
            console.log(e)
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`⛔ Error`)
                    .setDescription(`${e}`)
                ]
            })
        }
    }
}