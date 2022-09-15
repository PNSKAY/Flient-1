module.exports = {
    name: "rateLimit",

    async execute(client, rateLimitData) {
        client.logger(JSON.stringify(rateLimitData).grey.italic.dim);
    }
}