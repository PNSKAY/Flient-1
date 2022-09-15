const {
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
const {
    Captcha
} = require('captcha-canvas');

module.exports = async (client) => {
    const description = {
        name: "captcha System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("guildMemberAdd", async (member) => {
        if(!member.guild) return;

        const data = client.captcha.get(member.guild.id);
        if (!data) return;
    
            const captcha = new Captcha();
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();
    
            const attachment = new MessageAttachment(
                await captcha.png,
                "captcha.png"
            );
    
            const CaptchaEmbed = new MessageEmbed()
            .setDescription(`Please Complete This Captcha`)
            .setImage("attachment://captcha.png")
    
            const msg = await member.send({
                files: [attachment],
                embeds: [CaptchaEmbed],
            }).catch((err) => console.log(`I was unable to send the captcha msg.`))
    
            const filter = (message) => {
                if (message.author.id !== member.id) return;
                if (message.content === captcha.text) return true;
                else member.send(`Wrong Captcha`).catch((err) => console.log(`I was unable to send the captcha wrong msg.`))
            };
    
            try {
              
            const resp = await msg.channel.awaitMessages({
                filter,
                max: 1,
                time: 100000,
                errors: ["time"],
            });
    
            if (resp) {
                member.send(`You have been verified`).catch((err) => console.log(`I was unable to send the captcha veified msg.`))
            }
    
        } catch (err) {
            await member.send(`You have not verified and i have kicked you`).catch((err) => console.log(`I was unable to send the captcha kick msg.`))
            member.kick(`Have not answer the captcha`).catch((err) => console.log(err))
        }
    });
    
};