module.exports = {
  name: "shardError",

  async execute(client, error, id) {
    client.logger(`Shard #${id} Errored`.brightRed);
  }
}