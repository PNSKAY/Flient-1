const roleData = require(`${process.cwd()}/structures/models/autorole`)

module.exports = async (client) => {
    const description = {
        name: "AutoRole",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("guildMemberAdd", async (member) => {
        if(!member.guild) return;
        try {
            const data = await roleData.findOne({
                GuildID: member.guild.id,
            }).catch(err => console.log(err));
    
            if (data) {
                let role = data.Role;
                let arole = member.guild.roles.cache.get(role);
                if (role) {
                    member.roles.add(arole).catch(err => console.log(err));
                } else if (!role) {
                    return;
                }
            } else if (!data) {
                return;
            }
        } catch (e) {
            console.log(e)
        }
    });
}