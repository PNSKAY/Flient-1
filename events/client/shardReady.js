module.exports = {
  name: "shardReady",

  async execute(client, id) {
    client.logger(`Shard #${id} Ready`.brightGreen);
  }
}