module.exports = async (client) => {
    
    require(`${process.cwd()}/modules/premium-system`)(client);
    require(`${process.cwd()}/modules/distubeEvents`)(client);
    require(`${process.cwd()}/modules/music-system`)(client);
    require(`${process.cwd()}/modules/giveawayEvents`)(client);
    require(`${process.cwd()}/modules/botInvitedMsg`)(client);
    require(`${process.cwd()}/modules/InivtedRemovedLogs`)(client);
    require(`${process.cwd()}/modules/afk`)(client);
    require(`${process.cwd()}/modules/chatbot`)(client);
    require(`${process.cwd()}/modules/ghostPing`)(client);
    require(`${process.cwd()}/modules/AntiLink`)(client);
    require(`${process.cwd()}/modules/antiDiscord`)(client);
    require(`${process.cwd()}/modules/autoDelete`)(client);
    require(`${process.cwd()}/modules/autoNick`)(client);
    require(`${process.cwd()}/modules/autoRole`)(client);
    //require(`${process.cwd()}/modules/buttonRole`)(client);
    require(`${process.cwd()}/modules/captchaSystem`)(client);
    require(`${process.cwd()}/modules/customCommands`)(client);
    require(`${process.cwd()}/modules/leveling`)(client);
    require(`${process.cwd()}/modules/menuRole`)(client);
    require(`${process.cwd()}/modules/welcomeLeaveSystem`)(client);
    require(`${process.cwd()}/modules/ticketCreation`)(client);
    require(`${process.cwd()}/modules/ticketOptions`)(client);
	
    client.logger(`Loaded Modules`.brightGreen);
}