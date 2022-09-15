module.exports = {
  name: "shardResume",

  async execute(client, id, replayedEvents) {
    client.logger(`Shard #${id} Resumed`.green)
  }
}