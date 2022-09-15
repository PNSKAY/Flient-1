const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {
  name: 'change-avatar',
  aliases: ["changeavatar"],
  usage: '',
  description: '',
  category: "ownerOnly",
  cooldown: 0,
  userPermissions: "",
  botPermissions: "",
  ownerOnly: true,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  async execute(client, message, args, ee, prefix) {
    var url;
    if (message.attachments.size > 0) {
      if (message.attachments.every(attachIsImage)) {
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFile(`./image.jpg`, buffer, () =>
          console.log('Finished downloading the Avatar!'));
        client.user.setAvatar(`./image.jpg`)
          .then(user => {
            return message.channel.send({
              embeds: [new MessageEmbed()
                .setTitle(`${client.allEmojis.y} Successfully changed the Bot Avatar!`)
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
              ]
            });
          })
          .catch(e => {
            return;
          });
      } else {
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setTitle(`${client.allEmojis.x} ERROR | Could not use your Image as an Avatar, make sure it is a \`png\` or \`jpg\``)
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      }
    } else if (message.content && textIsImage(message.content)) {
      url = args.join(" ")
      const response = await fetch(url);
      const buffer = await response.buffer();
      await fs.writeFile(`./image.jpg`, buffer, () =>
        console.log('finished downloading the Avatar!'));
      client.user.setAvatar(`./image.jpg`)
        .then(user => {
          try {
            fs.unlinkSync()
          } catch {

          }
          return message.channel.send({
            embeds: [new MessageEmbed()
              .setTitle(`${client.allEmojis.y} Successfully changed the Bot Avatar!`)
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
            ]
          });
        })
        .catch(e => {
          return;
        });

    } else {
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setTitle(`${client.allEmojis.x} ERROR | Could not use your Image as an Avatar, make sure it is a \`png\` or \`jpg\``)
          .setDescription(`**Usage:** \`${prefix}change-avatar <AVATARLINK/IMAGE>\``)
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
    }
  }
}

function attachIsImage(msgAttach) {
    url = msgAttach.url;

    //True if this url is a png image.
    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
  }

  function textIsImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }