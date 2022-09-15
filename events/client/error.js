module.exports = {
    name: "error",

    async execute(client, error) {
        client.logger(String(error).red.dim);
    }
}