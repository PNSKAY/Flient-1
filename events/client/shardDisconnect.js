module.exports = {
  name: "shardDisconnect",

  async execute(client, event, id) {
    client.logger(`Shard #${id} Disconnected`.brightRed);
  }
}