const { Collection } = require("discord.js");
const config = require("../botconfig/config.json");

module.exports = async (client) => {
    
    client.commands = new Collection();
	client.slashCommands = new Collection();
	client.events = new Collection();
	client.aliases = new Collection();
	client.cooldowns = new Collection();
    client.allEmojis = require("../botconfig/emojis.json");
    client.owners = config.ownerID;
    client.premiumActivator = config.Premium_Activator;
    client.premiumServers = new Collection();
    client.blacklistWords = new Collection();
    client.blacklistWordsChannel = new Collection();
	
    client.logger(`Loaded Client_Variables`.brightGreen);
}