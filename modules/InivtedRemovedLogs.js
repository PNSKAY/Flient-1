const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  MessageEmbed
} = require('discord.js');

module.exports = async (client) => {
    const description = {
        name: "Inivted Removed Logs",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    // Invited Log
    client.on("guildCreate", async (guild) => {
        try {
            if (!guild || guild.available === false) return
            let theowner = "NO OWNER DATA! ID: ";
            await guild.fetchOwner().then(({ user }) => {
              theowner = user;
            }).catch(() => {})
      
            const channel = client.channels.cache.get(config.botlogs.inviteLogs);
            if (!channel) return;
            
            const embed = new MessageEmbed()
            .setTitle(`${client.allEmojis.y} Added To New Guild!`)
            .addField(`Guild Info`,
            `>>> **Guild Name:** \`${guild.name}\`
**Guild ID:** \`${guild.id}\`
**Owner Name:** \`${theowner ? `${theowner.tag}` : `${theowner}`}\`
**Owner ID:** \`${theowner ? `${theowner.id}` : `${guild.ownerId}`}\`
**Member Count:** \`${guild.memberCount}\``)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor("GREEN")
            .setFooter(`Currently in ${client.guilds.cache.size} guilds!`)
            .setTimestamp();
            channel.send({embeds: [embed]}).catch(() => {})
          } catch (e) {
              console.log(e)
          }
    });

    // Removed Log
    client.on("guildDelete", async (guild) => {
        try {
            if (!guild || guild.available === false) return
            let theowner = "NO OWNER DATA! ID: ";
            await guild.fetchOwner().then(({ user }) => {
              theowner = user;
            }).catch(() => {})
      
            const channel = client.channels.cache.get(config.botlogs.inviteLogs);
            if (!channel) return;
            
            const embed = new MessageEmbed()
            .setTitle(`${client.allEmojis.x} Removed From The Guild!`)
            .addField(`Guild Info`,
            `>>> **Guild Name:** \`${guild.name}\`
**Guild ID:** \`${guild.id}\`
**Owner Name:** \`${theowner ? `${theowner.tag}` : `${theowner}`}\`
**Owner ID:** \`${theowner ? `${theowner.id}` : `${guild.ownerId}`}\`
**Member Count:** \`${guild.memberCount}\``)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor("RED")
            .setFooter(`Currently in ${client.guilds.cache.size} guilds!`)
            .setTimestamp();
            channel.send({embeds: [embed]}).catch(() => {})
          } catch (e) {
              console.log(e)
          }
    });
}