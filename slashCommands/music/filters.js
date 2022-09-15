const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: 'filters',
    usage: '',
    description: 'Toggle filters',
    category: "music",
    cooldown: 0,
    userPermissions: "",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    premium: true,
    options: [{
            name: "list_filters1",
            description: "Choose a filter",
            type: "STRING",
            required: false,
            choices: [{
                    name: "♨️ Clear All Filters",
                    value: "false"
                },
                {
                    name: "♨️ clear",
                    value: "clear"
                },
                {
                    name: "♨️ lightbass",
                    value: "lightbass"
                },
                {
                    name: "♨️ heavybass",
                    value: "heavybass"
                },
                {
                    name: "♨️ bassboost",
                    value: "bassboost"
                },
                {
                    name: "♨️ custombassboost",
                    value: "custombassboost"
                },
                {
                    name: "♨️ echo",
                    value: "echo"
                },
                {
                    name: "♨️ earwax",
                    value: "earwax"
                },
                {
                    name: "♨️ 8d",
                    value: "8d"
                },
                {
                    name: "♨️ customspeed",
                    value: "customspeed"
                },
                {
                    name: "♨️ purebass",
                    value: "purebass"
                },
                {
                    name: "♨️ vaporwave",
                    value: "vaporwave"
                },
                {
                    name: "♨️ nightcore",
                    value: "nightcore"
                },
                {
                    name: "♨️ phaser",
                    value: "phaser"
                },
                {
                    name: "♨️ tremolo",
                    value: "tremolo"
                },
                {
                    name: "♨️ vibrato",
                    value: "vibrato"
                },
                {
                    name: "♨️ reverse",
                    value: "reverse"
                },
                {
                    name: "♨️ treble",
                    value: "treble"
                },
                {
                    name: "♨️ surrounding",
                    value: "surrounding"
                },
                {
                    name: "♨️ pulsator",
                    value: "pulsator"
                },
                {
                    name: "♨️ subboost",
                    value: "subboost"
                },
                {
                    name: "♨️ karaoke",
                    value: "karaoke"
                },
                {
                    name: "♨️ flanger",
                    value: "flanger"
                },
                {
                    name: "♨️ gate",
                    value: "gate"
                },
                {
                    name: "♨️ haas",
                    value: "haas"
                }
            ],
        },
        {
            name: "list_filters2",
            description: "Choose a filter",
            type: "STRING",
            required: false,
            choices: [{
                    name: "♨️ mcompand",
                    value: "mcompand"
                },
                {
                    name: "♨️ earrape",
                    value: "earrape"
                },
                {
                    name: "♨️ bassboost1",
                    value: "bassboost1"
                },
                {
                    name: "♨️ bassboost2",
                    value: "bassboost2"
                },
                {
                    name: "♨️ bassboost3",
                    value: "bassboost3"
                },
                {
                    name: "♨️ bassboost4",
                    value: "bassboost4"
                },
                {
                    name: "♨️ bassboost5",
                    value: "bassboost5"
                },
                {
                    name: "♨️ bassboost6",
                    value: "bassboost6"
                },
                {
                    name: "♨️ bassboost7",
                    value: "bassboost7"
                },
                {
                    name: "♨️ bassboost8",
                    value: "bassboost8"
                },
                {
                    name: "♨️ bassboost9",
                    value: "bassboost9"
                },
                {
                    name: "♨️ bassboost10",
                    value: "bassboost10"
                },
                {
                    name: "♨️ bassboost11",
                    value: "bassboost11"
                },
                {
                    name: "♨️ bassboost12",
                    value: "bassboost12"
                },
                {
                    name: "♨️ bassboost13",
                    value: "bassboost13"
                },
                {
                    name: "♨️ bassboost14",
                    value: "bassboost14"
                },
                {
                    name: "♨️ bassboost15",
                    value: "bassboost15"
                },
                {
                    name: "♨️ bassboost16",
                    value: "bassboost16"
                },
                {
                    name: "♨️ bassboost17",
                    value: "bassboost17"
                },
                {
                    name: "♨️ bassboost18",
                    value: "bassboost18"
                },
                {
                    name: "♨️ bassboost19",
                    value: "bassboost19"
                },
                {
                    name: "♨️ bassboost20",
                    value: "bassboost20"
                }
            ],
        }
    ],

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
            switch (options.getString("list_filters1")) {
                case "false":
                    await queue.setFilter(false);
                    return interaction.reply({
                        content: `♨️ Clear All Applied Filters.`
                    });

                case "clear":
                    await queue.setFilter(`clear`);
                    return interaction.reply({
                        content: `♨️ Applied **clear** Filter.`
                    });

                case "lightbass":
                    await queue.setFilter(`lightbass`);
                    return interaction.reply({
                        content: `♨️ Applied **lightbass** Filter.`
                    });

                case "heavybass":
                    await queue.setFilter(`heavybass`);
                    return interaction.reply({
                        content: `♨️ Applied **heavybass** Filter.`
                    });

                case "bassboost":
                    await queue.setFilter(`bassboost`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost** Filter.`
                    });

                case "custombassboost":
                    await queue.setFilter(`custombassboost`);
                    return interaction.reply({
                        content: `♨️ Applied **custombassboost** Filter.`
                    });

                case "echo":
                    await queue.setFilter(`echo`);
                    return interaction.reply({
                        content: `♨️ Applied **echo** Filter.`
                    });

                case "earwax":
                    await queue.setFilter(`earwax`);
                    return interaction.reply({
                        content: `♨️ Applied **earwax** Filter.`
                    });

                case "8d":
                    await queue.setFilter(`8d`);
                    return interaction.reply({
                        content: `♨️ Applied **8d** Filter.`
                    });

                case "customspeed":
                    await queue.setFilter(`customspeed`);
                    return interaction.reply({
                        content: `♨️ Applied **customspeed** Filter.`
                    });

                case "purebass":
                    await queue.setFilter(`purebass`);
                    return interaction.reply({
                        content: `♨️ Applied **purebass** Filter.`
                    });

                case "vaporwave":
                    await queue.setFilter(`vaporwave`);
                    return interaction.reply({
                        content: `♨️ Applied **vaporwave** Filter.`
                    });

                case "nightcore":
                    await queue.setFilter(`nightcore`);
                    return interaction.reply({
                        content: `♨️ Applied **nightcore** Filter.`
                    });

                case "phaser":
                    await queue.setFilter(`phaser`);
                    return interaction.reply({
                        content: `♨️ Applied **phaser** Filter.`
                    });

                case "tremolo":
                    await queue.setFilter(`tremolo`);
                    return interaction.reply({
                        content: `♨️ Applied **tremolo** Filter.`
                    });

                case "vibrato":
                    await queue.setFilter(`vibrato`);
                    return interaction.reply({
                        content: `♨️ Applied **vibrato** Filter.`
                    });

                case "reverse":
                    await queue.setFilter(`reverse`);
                    return interaction.reply({
                        content: `♨️ Applied **reverse** Filter.`
                    });

                case "treble":
                    await queue.setFilter(`treble`);
                    return interaction.reply({
                        content: `♨️ Applied **treble** Filter.`
                    });

                case "surrounding":
                    await queue.setFilter(`surrounding`);
                    return interaction.reply({
                        content: `♨️ Applied **surrounding** Filter.`
                    });

                case "pulsator":
                    await queue.setFilter(`pulsator`);
                    return interaction.reply({
                        content: `♨️ Applied **pulsator** Filter.`
                    });

                case "subboost":
                    await queue.setFilter(`subboost`);
                    return interaction.reply({
                        content: `♨️ Applied **subboost** Filter.`
                    });

                case "karaoke":
                    await queue.setFilter(`karaoke`);
                    return interaction.reply({
                        content: `♨️ Applied **karaoke** Filter.`
                    });

                case "flanger":
                    await queue.setFilter(`flanger`);
                    return interaction.reply({
                        content: `♨️ Applied **flanger** Filter.`
                    });

                case "gate":
                    await queue.setFilter(`gate`);
                    return interaction.reply({
                        content: `♨️ Applied **gate** Filter.`
                    });

                case "haas":
                    await queue.setFilter(`haas`);
                    return interaction.reply({
                        content: `♨️ Applied **haas** Filter.`
                    });
            }


            switch (options.getString("list_filters2")) {
                case "mcompand":
                    await queue.setFilter(`mcompand`);
                    return interaction.reply({
                        content: `♨️ Applied **mcompand** Filter.`
                    });

                case "earrape":
                    await queue.setFilter(`earrape`);
                    return interaction.reply({
                        content: `♨️ Applied **earrape** Filter.`
                    });

                case "bassboost1":
                    await queue.setFilter(`bassboost1`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost1** Filter.`
                    });

                case "bassboost2":
                    await queue.setFilter(`bassboost2`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost2** Filter.`
                    });

                case "bassboost3":
                    await queue.setFilter(`bassboost3`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost3** Filter.`
                    });

                case "bassboost4":
                    await queue.setFilter(`bassboost4`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost4** Filter.`
                    });

                case "bassboost5":
                    await queue.setFilter(`bassboost5`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost5** Filter.`
                    });

                case "bassboost6":
                    await queue.setFilter(`bassboost6`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost6** Filter.`
                    });

                case "bassboost7":
                    await queue.setFilter(`bassboost7`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost7** Filter.`
                    });

                case "bassboost8":
                    await queue.setFilter(`bassboost8`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost8** Filter.`
                    });

                case "bassboost9":
                    await queue.setFilter(`bassboost9`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost9** Filter.`
                    });

                case "bassboost10":
                    await queue.setFilter(`bassboost10`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost10** Filter.`
                    });

                case "bassboost11":
                    await queue.setFilter(`bassboost11`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost11** Filter.`
                    });

                case "bassboost12":
                    await queue.setFilter(`bassboost12`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost12** Filter.`
                    });

                case "bassboost13":
                    await queue.setFilter(`bassboost13`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost13** Filter.`
                    });

                case "bassboost14":
                    await queue.setFilter(`bassboost14`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost14** Filter.`
                    });

                case "bassboost15":
                    await queue.setFilter(`bassboost15`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost15** Filter.`
                    });

                case "bassboost16":
                    await queue.setFilter(`bassboost16`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost16** Filter.`
                    });

                case "bassboost17":
                    await queue.setFilter(`bassboost17`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost17** Filter.`
                    });

                case "bassboost18":
                    await queue.setFilter(`bassboost18`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost18** Filter.`
                    });

                case "bassboost19":
                    await queue.setFilter(`bassboost19`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost19** Filter.`
                    });

                case "bassboost20":
                    await queue.setFilter(`bassboost20`);
                    return interaction.reply({
                        content: `♨️ Applied **bassboost20** Filter.`
                    });

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