const config = require(`${process.cwd()}/structures/botconfig/config.json`);
const {
  Client,
  Message,
  MessageEmbed,
  Util: {
    splitMessage
  },
  MessageAttachment,
  MessageActionRow,
  MessageButton,
  Collection
} = require(`discord.js`);
const Discord = require(`discord.js`);
const moment = require("moment");
const ms = require("ms")
const {
  inspect
} = require(`util`);

module.exports = {
  name: `eval`,
  aliases: [`evaluate`],
  description: `eval Command`,
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

    if (!args[0])
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(client.user.username, ee.footericon)
          .setTitle(`${client.allEmojis.x} You have to at least include 1 arguments`)
        ]
      });
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");
    let output = await eval(args.join(` `));
    if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;

    output = inspect(output, { depth: 0, maxArrayLength: null });
  
    output = output.replace(filter, "**\\*\\*\\*\\*\\*\\*\\*\\*T\\*O\\*K\\*E\\*N\\*\\*\\*\\*\\*\\*\\*\\***");
    let string = output;
    //if the token is included return error
    //if (string.includes(client.token)) return console.log(`ERROR NO TOKEN GRABBING ;)`.dim);
    //define queueembed
    let evalEmbed = new MessageEmbed()
      .setTitle(`${client.allEmojis.y} Eval Command`)
      .setColor(ee.color);
    //split the description
    const splitDescription = splitMessage(string, {
      maxLength: 2040,
      char: `\n`,
      prepend: ``,
      append: ``
    });
    //(over) write embed description
    evalEmbed.setDescription(`\`\`\`` + splitDescription[0] + `\`\`\``);
    //send embed
    message.channel.send({
      embeds: [evalEmbed]
    });
  },
};