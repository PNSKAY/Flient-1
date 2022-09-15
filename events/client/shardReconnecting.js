module.exports = {
  name: "shardReconnecting",

  async execute(client, id) {
    client.logger(`Shard #${id} Reconnecting`.brightMagenta);
  }
}