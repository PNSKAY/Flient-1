const {
    GiveawaysManager
} = require('discord-giveaways');

module.exports = async (client) => {
    const description = {
        name: "Giveaway Events",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);
    
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return client.giveaways.fetchEverything().array();
        }

        async saveGiveaway(messageId, giveawayData) {
            client.giveaways.set(messageId, giveawayData);
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            client.giveaways.set(messageId, giveawayData);
            return true;
        }

        async deleteGiveaway(messageId) {
            client.giveaways.delete(messageId);
            return true;
        }
        
        async refreshStorage() {
            return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
        }
    };

    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: '#FFD700',
            embedColorEnd: '#FF0000',
            reaction: `${client.allEmojis.giveaway.react}`
        }
    });
    client.giveawaysManager = manager;
}