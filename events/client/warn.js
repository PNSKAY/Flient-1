module.exports = {
  name: "warn",

  async execute(client, error) {
    client.logger(String(error).yellow.dim);
  }
}