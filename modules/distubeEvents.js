const Discord = require(`discord.js`);
const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const ee = require(`${process.cwd()}/structures/botconfig/embed.json`);
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed
} = require(`discord.js`);

module.exports = async (client) => {
  const description = {
        name: "Distube Events",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);
  try {

    const MusicButtons = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('music-skip')
        .setEmoji(client.allEmojis.musicButtons.skip)
        .setLabel('Skip')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('music-pause')
        .setEmoji(client.allEmojis.musicButtons.pause)
        .setLabel('Pause')
        .setStyle('SECONDARY'),
        new MessageButton()
        .setCustomId('music-resume')
        .setEmoji(client.allEmojis.musicButtons.resume)
        .setLabel('Resume')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('music-stop')
        .setEmoji(client.allEmojis.musicButtons.stop)
        .setLabel('Stop')
        .setStyle('DANGER'),
        new MessageButton()
        .setCustomId('music-queue')
        .setEmoji(client.allEmojis.musicButtons.queue)
        .setLabel('Queue')
        .setStyle('PRIMARY'),
      );

    const MusicButtons2 = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('music-shuffle')
        .setEmoji(client.allEmojis.musicButtons.shuffle)
        .setLabel('Shuffle')
        .setStyle('SECONDARY'),
        new MessageButton()
        .setCustomId('music-autoplay')
        .setEmoji(client.allEmojis.musicButtons.autoplay)
        .setLabel('Autoplay')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('music-10s-less')
        .setEmoji(client.allEmojis.musicButtons.less10Sec)
        .setLabel('- 10 Sec')
        .setStyle('DANGER'),
        new MessageButton()
        .setCustomId('music-10s-more')
        .setEmoji(client.allEmojis.musicButtons.forward10Sec)
        .setLabel('+ 10 Sec')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('music-lyrics')
        .setEmoji(client.allEmojis.musicButtons.lyrics)
        .setLabel('Lyrics')
        .setStyle('PRIMARY'),
      );

    const MusicButtons3 = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('music-loop')
        .setEmoji(client.allEmojis.musicButtons.loop)
        .setLabel('Loop')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('music-volume-negative')
        .setEmoji(client.allEmojis.musicButtons.negative10vol)
        .setLabel('- 10 Vol')
        .setStyle('DANGER'),
        new MessageButton()
        .setCustomId('music-volume-plus')
        .setEmoji(client.allEmojis.musicButtons.plus10vol)
        .setLabel('+ 10 Vol')
        .setStyle('SUCCESS'),
      );


    const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
    client.distube
      .on("playSong", (queue, song) => queue.textChannel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setDescription(`${status(queue)}`)
          .setAuthor(`${song.name} - ${song.formattedDuration}`, `${client.allEmojis.music.playImg}`, song.url)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          .setFooter(`Requested By: ${song.user.tag}`, song.user.displayAvatarURL({
            dynamic: true
          }))
        ],
        components: [MusicButtons, MusicButtons2, MusicButtons3]
      }))
      .on("addSong", (queue, song) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setFooter("Added By: " + song.user.tag, song.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.y} Song Added to the Queue`)
          .setDescription(`Added ${song.name} - \`${song.formattedDuration}\` to the queue`)
        ]
      }))
      .on("addList", (queue, playlist) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setFooter("Added By: " + playlist.user.tag, playlist.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.y} Playlist Added to the Queue`)
          .setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`)
        ]
      }))
      .on("searchResult", (message, result) => {
        let i = 0
        message.channel.send({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
            .setTitle(`Choose an option from below`)
            .setDescription(`${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
          ]
        })
      })
      .on("searchCancel", message => message.channel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setTitle(`⛔️ Searching Canceled`)
        ]
      }))
      .on("error", (channel, e) => {
        console.error(e);
        channel.send({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
            .setTitle(`⛔️ Error`)
            .setDescription(`${e}`)
          ]
        })
      })
      .on("empty", queue => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setTitle(`⛔️ Leaving Channel`)
          .setDescription(`Voice channel is empty! Leaving the channel...`)
        ]
      }))
      .on("searchNoResult", message => message.channel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setDescription(`**No result found!**`)
        ]
      }))
      .on("finish", queue => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("⛔️ SONG FINISHED, LEAVING...")
          .setDescription("🎧 **There are no more songs in the queue leaving...**")
          .setTimestamp()
        ]
      }))
      .on(`finishSong`, (queue, song) => {
        queue.textChannel.send({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setAuthor(`${song.name}`, `https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png`, song.url)
            .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
  } catch (e) {
    console.log(e)
  }
};
