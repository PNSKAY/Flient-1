const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'play',
    aliases: ["p"],
    usage: '',
    description: '',
    category: "music",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,

    /**
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */

    async execute(client, message, args, ee) {
        try {

            const {
                member,
                guild,
            } = message;

            const {
                channel
            } = member.voice;


            const search = args.join(" ")

            if (!search) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.mediancolor)
                    .setTimestamp()
                    .setTitle(`${client.allEmojis.m} Please specify a name of the song or link of the song`)
                ]
            });

            const VoiceChannel = member.voice.channel;

            if (!VoiceChannel) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTimestamp()
                    .setTitle(`${client.allEmojis.x} Please Join a Voice Channel`)
                ]
            });

            if (channel.userLimit != 0 && channel.full)
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`Your Voice Channel is full, I can't join!`)
                    ]
                });


            if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTimestamp()
                    .setDescription(`**I am already playing music in <#${guild.me.voice.channelId}>**`)
                ]
            });

            let newmsg = await message.reply({
                content: `>>> ${client.allEmojis.music.searching} Searching: **${search}**`,
            }).catch(e => {
                console.log(e)
            })

            const queue = await client.distube.getQueue(VoiceChannel);
            await client.distube.playVoiceChannel(VoiceChannel, search, {
                textChannel: message.channel,
                member: member
            });

            newmsg.edit({
                content: `>>> ${queue?.songs?.length > 0 ? `${client.allEmojis.music.queue} Added to Queue` : `${client.allEmojis.music.play} Playing`}: **${search}**`,
            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`⛔ Error`)
                    .setDescription(`${e}`)
                ]
            })
        }
    }
}