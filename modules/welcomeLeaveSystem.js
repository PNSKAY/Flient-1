const Schema = require(`${process.cwd()}/structures/models/welcomeSchema`);
const Schema2 = require(`${process.cwd()}/structures/models/goodbyeSchema`);
const Canvas = require("canvas");
const {
  MessageAttachment
} = require("discord.js");

module.exports = async (client) => {
    const description = {
        name: "Welcome Leave System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    // Welcome System
    client.on("guildMemberAdd", async (member) => {
        if(!member.guild) return;
        try {

            // ${backgroundArray[Math.floor(Math.random() * backgroundArray.length)]}
            var backgroundArray = [
              `https://cdn.discordapp.com/attachments/907875631000334346/910117742533820436/wp4694506-pixels-art-wallpapers.jpg`,
              `https://cdn.discordapp.com/attachments/907875631000334346/910146026382430249/v2cmfx8rbdv11.jpg`,
              `https://cdn.discordapp.com/attachments/907875631000334346/910149891873972254/LVtDUQX.jpg`,
              `https://cdn.discordapp.com/attachments/907875631000334346/910146033953177610/720499.jpg`,
              `https://cdn.discordapp.com/attachments/907875631000334346/910146952803524648/chillin-fox-wallpaper_1.jpg`,
            ];
            
            Schema.findOne({
              Guild: member.guild.id
            }, async (e, data) => {
              if (!data) return;
        
              const canvas = Canvas.createCanvas(1024, 500);
        
              const ctx = canvas.getContext('2d');
        
              const background = await Canvas.loadImage(`${backgroundArray[Math.floor(Math.random() * backgroundArray.length)]}`);
              ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
              ctx.strokeStyle = '#f2f2f2';
              ctx.strokeRect();
        
              var textString3 = `${member.user.tag}`;
              ctx.font = '42px Impact';
              ctx.textAlign = 'center';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(textString3, 512, 410);
        
              var textString2 = `WELCOME`;
              ctx.font = '72px Impact';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(textString2, 512, 360);
              ctx.beginPath();
              ctx.stroke()
              ctx.arc(512, 166, 128, 0, Math.PI * 2, true); //position of img
              ctx.fill()
        
              var textString4 = `YOU ARE THE ${member.guild.memberCount}TH MEMBER OF OUR SERVER`;
              ctx.textAlign = 'center';
              ctx.font = '32px Impact';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(textString4, 512, 455);
              ctx.beginPath();
              ctx.arc(512, 166, 119, 0, Math.PI * 2, true); //position of img
              ctx.closePath();
              ctx.clip();
        
              const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
                format: 'jpg',
                size: 1024
              }));
        
              ctx.drawImage(avatar, 393, 47, 238, 238);
        
              const attachment = new MessageAttachment(canvas.toBuffer(), `welcome-${member.id}.jpg`);
        
              const channel = member.guild.channels.cache.get(data.Channel);
              if (!channel) return;
        
              await channel.send({ content: data.WelcomeMsg.replace(/<@>/g, `${member}`).replace(/<server>/g, `${member.guild.name}`).replace(/<count>/g, `${member.guild.memberCount}`), files: [attachment] }).catch(err => console.log('I was unable to send welcome image.'));
            })
          } catch (e) {
            console.log(e)
          }
    });

    // Leave System
    client.on("guildMemberRemove", async (member) => {
        if(!member.guild) return;
      try {
    
        // ${backgroundArray[Math.floor(Math.random() * backgroundArray.length)]}
        var backgroundArray = [
          `https://cdn.discordapp.com/attachments/907875631000334346/910117742533820436/wp4694506-pixels-art-wallpapers.jpg`,
          `https://cdn.discordapp.com/attachments/907875631000334346/910146026382430249/v2cmfx8rbdv11.jpg`,
          `https://cdn.discordapp.com/attachments/907875631000334346/910149891873972254/LVtDUQX.jpg`,
          `https://cdn.discordapp.com/attachments/907875631000334346/910146033953177610/720499.jpg`,
          `https://cdn.discordapp.com/attachments/907875631000334346/910146952803524648/chillin-fox-wallpaper_1.jpg`,
        ];
    
        Schema2.findOne({
          Guild: member.guild.id
        }, async (e, data) => {
          if (!data) return;
          //create a new Canvas
          const canvas = Canvas.createCanvas(1024, 500);
          //make it "2D"
          const ctx = canvas.getContext('2d');
          //set the Background to the welcome.png
          const background = await Canvas.loadImage(`${backgroundArray[Math.floor(Math.random() * backgroundArray.length)]}`);
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#f2f2f2';
          ctx.strokeRect();
          //set the first text string 
          var textString3 = `${member.user.tag}`;
          //if the text is too big then smaller the text
          ctx.font = '42px Impact';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(textString3, 512, 410);
          //define the Discriminator Tag
          var textString2 = `GOODBYE`;
          ctx.font = '72px Impact';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(textString2, 512, 360);
          ctx.beginPath();
          ctx.stroke()
          ctx.arc(512, 166, 128, 0, Math.PI * 2, true); //position of img
          ctx.fill()
          //define the Member count
          var textString4 = `GOODBYE FROM ${member.guild.name}`;
          ctx.textAlign = 'center';
          ctx.font = '32px Impact';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(textString4, 512, 455);
          // //get the Guild Name
          // var textString4 = `${member.guild.name}`;
          // ctx.font = 'bold 60px Genta';
          // ctx.fillStyle = '#f2f2f2';
          // ctx.fillText(textString4, 700, canvas.height / 2 - 150);
          //create a circular "mask"
          ctx.beginPath();
          ctx.arc(512, 166, 119, 0, Math.PI * 2, true); //position of img
          ctx.closePath();
          ctx.clip();
          //define the user avatar
          const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
            format: 'jpg',
            size: 1024
          }));
          //draw the avatar
          ctx.drawImage(avatar, 393, 47, 238, 238);
          //get it as a discord attachment
          const attachment = new MessageAttachment(canvas.toBuffer(), `goodbye-${member.id}.jpg`);
          //define the welcome channel
          const channel = member.guild.channels.cache.get(data.Channel);
          if (!channel) return;
          //send the welcome embed to there
          await channel.send({ content: `Look like **${member.user.tag}** just left the server <a:crying:910146626327285781>`, files: [attachment] }).catch(err => console.log('I was unable to send goodbye image.'));
          //member roles add on welcome every single role
        })
      } catch (e) {
        console.log(e)
      }
  });

};


/**
 * @INFO
 * Bot Coded by Zedro#2742 | https://discord.gg/8fYUFxMtAq
 * @INFO
 * Work for Milanio Development | https://discord.gg/8fYUFxMtAq
 * @INFO
 * Please Mention Us Milanio Development, When Using This Code!
 * @INFO
 */