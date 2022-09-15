const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const Data = require(`${process.cwd()}/structures/models/ticket-guild`);

module.exports = {
    name: "ticket-setup",
    usage: '',
    description: "Ticket System Setup",
    category: "setup",
    cooldown: 0,
    userPermissions: "ADMINISTRATOR",
    botPermissions: "",
    ownerOnly: false,
    toggleOff: false,
    options: [{
            name: "channel",
            description: "The Channel where the ticket is sent",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
            required: true
        }, {
            name: "category",
            description: "The Category where ticket is Opened",
            type: "CHANNEL",
            channelTypes: ["GUILD_CATEGORY"],
            required: true
        },
        // {
        //     name: "closed_category",
        //     description: "The category when the ticket is closed",
        //     type: "CHANNEL",
        //     channelTypes: ["GUILD_CATEGORY"],
        //     required: true
        // },
        {
            name: "transcript",
            description: "where the transcript is sented!",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
            required: true
        },
        {
            name: "button_name",
            description: "The Create Button Name!",
            type: "STRING",
            required: true
        },
        {
            name: "role1",
            description: "The Admin /Mod / Staff Role",
            type: "ROLE",
            required: true
        },
        {
            name: "role2",
            description: "The Admin /Mod / Staff Role",
            type: "ROLE",
            required: true
        },
        {
            name: "role3",
            description: "The Admin /Mod / Staff Role",
            type: "ROLE",
            required: true
        },
        {
            name: "panel-title",
            description: "Title of the Ticket Panel Embed",
            type: "STRING",
            required: true
        },
        {
            name: "panel-description",
            description: "Description of the Ticket Panel Embed",
            type: "STRING",
            required: true
        },
        {
            name: "ticket-open-description",
            description: "Description of the Ticket Open Embed, Use <@> to replace with user",
            type: "STRING",
            required: true
        },

    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async execute(client, interaction, args, ee) {
        try {

            const TicketSent = interaction.options.getChannel("channel");
            const openCategory = interaction.options.getChannel("category");
            // const closedCategory = interaction.options.getChannel("closed_category");
            const transcriptChannel = interaction.options.getChannel("transcript");
            const role1 = interaction.options.getRole("role1");
            const role2 = interaction.options.getRole("role2");
            const role3 = interaction.options.getRole("role3");
            const ButtonName = interaction.options.getString("button_name");
            const EmbedDescription = interaction.options.getString("panel-description") || "If you need any help then open a Ticket";
            const EmbedTitle = interaction.options.getString("panel-title");
            const EmbedOpenDescription = interaction.options.getString("ticket-open-description") || "Hello <@>,\nThe staff will be here as soon as possible mean while tell us about your issue!";

            const data = await Data.findOne({
                guildID: interaction.guild.id
            })

            if (!data) {
                new Data({
                    guildID: interaction.guild.id,
                    index: 0,
                    CategoryID: openCategory.id,
                    // Closed_CategoryID: closedCategory.id,
                    Transcript: transcriptChannel.id,
                    OpenDescription: EmbedOpenDescription,
                    Role1: role1.id,
                    Role2: role2.id,
                    Role3: role3.id
                }).save()
            }

            await Data.findOneAndUpdate({
                guildID: interaction.guild.id
            }, {
                CategoryID: openCategory.id,
                // Closed_CategoryID: closedCategory.id,
                Transcript: transcriptChannel.id,
                OpenDescription: EmbedOpenDescription,
                Role1: role1.id,
                Role2: role2.id,
                Role3: role3.id
            })

            const TicketEmbed = new MessageEmbed()
                .setColor("#FFD700")
                .setTitle(`${EmbedTitle}`)
                .setDescription(`${EmbedDescription}`)
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({
                        dynamic: true
                    })
                })

            const TicketButton = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('ticket-create')
                    .setEmoji("📨")
                    .setLabel(`${ButtonName}`)
                    .setStyle('SECONDARY'),
                );

            TicketSent.send({
                embeds: [TicketEmbed],
                components: [TicketButton]
            })

            await interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor("#FFD700")
                    .setTitle(`Ticket System`)
                    .setDescription(`Successfully Setup Ticket System!`)
                ]
            })

        } catch (e) {
            console.log(e)
        }
    }
};