const User = require(`${process.cwd()}/structures/models/premium-server`);
const cron = require('node-cron')

module.exports = async (client) => {

    const description = {
        name: "Premium System",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("ready", async () => {
        const users = await User.find();
        for (let user of users) {
            client.premiumServers.set(user.Id, user);
        }
    })

    cron.schedule("*/60 * * * * *", async () => {
        await User.find({
            isPremium: true
        }, async (err, users) => {
            if (users && users.length) {
                // Set the expire Date and Time for our User + Code
                for (let user of users) {
                    if (Date.now() >= user.premium.expiresAt) {
                        // Default: The user is not a premium User
                        user.isPremium = false;
                        user.premium.redeemedBy = [];
                        user.premium.redeemedAt = null;
                        user.premium.expiresAt = null;
                        user.premium.plan = null;

                        // Save the updated user within the usersSettings.
                        const newUser = await user.save({
                            new: true
                        }).catch(() => {});
                        client.premiumServers.set(newUser.Id, newUser);
                    }
                }
            }
        });
    });
}