const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const {
    Color,
    isColor
} = require("coloras");

module.exports = {
    name: "embedbuilder",
    usage: '',
    description: "Embed creator.",
    category: "utility",
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
            name: 'title',
            type: 'STRING',
            description: "Choose a title.",
            required: true,
        },
        {
            name: 'url',
            type: 'STRING',
            description: "Choose a url for title.",
            required: false,
        },
        {
            name: 'description',
            type: 'STRING',
            description: "Choose a description.",
            required: false,
        },
        {
            name: 'image',
            type: 'STRING',
            description: "Choose a image.",
            required: false,
        },
        {
            name: 'thumbnail',
            type: 'STRING',
            description: "Choose a thumbnail.",
            required: false,
        },
        {
            name: 'color',
            type: 'STRING',
            description: "Choose a color in (RGB, HEX, HSL, HSV, CMYK).",
            required: false,
        },
        {
            name: 'footer',
            type: 'STRING',
            description: "Choose a footer.",
            required: false,
        },
        {
            name: "author",
            type: "USER",
            required: false,
            description: 'Choose a author.'
        },
        {
            name: "channel",
            type: "CHANNEL",
            required: false,
            description: 'Choose a channel to send it.'
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {

        try {
            const ch = interaction.options.getChannel('channel') || interaction.channel;
            const channelstype = interaction.guild.channels.cache.get(ch.id)
            if (!channelstype) return interaction.reply({
                content: `You must enter a valid channel.`
            })
            if (channelstype.type !== 'GUILD_TEXT') return interaction.reply({
                content: `You must enter a valid text channel.`
            })

            const author = interaction.options.getUser('author');

            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const couleurr = interaction.options.getString('color');
            const url = interaction.options.getString('url');
            const image = interaction.options.getString('image');
            const thumbnail = interaction.options.getString('thumbnail');
            const footer = interaction.options.getString('footer');

            const resultat = new MessageEmbed()
                .setTitle(title)

            if (description) resultat.setDescription(description)

            if (couleurr) {
                if (!isColor(couleurr).color) return interaction.reply({
                    content: `You must enter a valid color. The colour can be in RGB, HEX, HSL, HSV, CMYK.`
                });
                const color = new Color(couleurr);
                resultat.setColor(color.toHex())
            }

            if (url) {
                if (url.includes('https://') || url.includes('http://')) {
                    resultat.setURL(url)
                } else {
                    return interaction.reply({
                        content: `<a:warn:906791748154568725> The link is not valid.`
                    })
                }
            }

            if (image) {
                if (image.includes('https://') || image.includes('http://')) {
                    resultat.setImage(image)
                } else {
                    return interaction.reply({
                        content: `<a:warn:906791748154568725> The link for the image is not valid.`
                    })
                }
            }

            if (thumbnail) {
                if (thumbnail.includes('https://') || thumbnail.includes('http://')) {
                    resultat.setThumbnail(thumbnail)
                } else {
                    return interaction.reply({
                        content: `<a:warn:906791748154568725> The link for the thumbnail is not valid.`
                    })
                }
            }

            if (author) {
                resultat.setAuthor(author.tag, author.displayAvatarURL({
                    dynamic: true
                }))
            }

            if (footer) {
                resultat.setFooter(footer)
            }

            channelstype.send({
                embeds: [resultat]
            })
            interaction.reply({
                content: `The embed has been sent to the channel ${channelstype}`
            })

        } catch (err) {

            return interaction.reply(`${bot.error} An error has occured. \nError: ${err} \n [Contact Support](https:///discord)`)
        }

    },
};