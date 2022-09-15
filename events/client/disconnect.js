module.exports = {
    name: "disconnect",

    async execute(client) {
        client.logger(`You have been disconnected at ${new Date()}.`.dim);
    }
}