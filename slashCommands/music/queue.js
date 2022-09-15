const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: 'queue',
    usage: '',
    description: 'Show the Queue',
    category: "music",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        const {
            options,
            member,
            guild,
            channel
        } = interaction;

        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel) return interaction.reply({
            embeds: [new MessageEmbed()
                .setColor("#FFD700")
                .setTimestamp()
                .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
            ],
            ephemeral: true
        });

        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.reply({
            embeds: [new MessageEmbed()
                .setColor("#FFD700")
                .setTimestamp()
                .setTitle(`I am already playing music in <#${guild.me.voice.channelId}>`)
            ],
            ephemeral: true
        });

        try {

            const queue = await client.distube.getQueue(VoiceChannel);
            if (!queue) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setTimestamp()
                    .setTitle(`${client.allEmojis.x} There is no Song in the Queue.`)
                ]
            });

            const q = queue.songs.map((song, i) => `${i === 0 ? "**Playing:**" : `**${i})**`} ${song.name} - \`${song.formattedDuration}\``).join("\n").substr(0, 4000)

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setTitle(`${client.allEmojis.music.queue} Queue of ${interaction.guild.name}`)
                    .setDescription(`${q}`)
                ]
            });

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