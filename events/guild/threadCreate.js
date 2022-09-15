module.exports = {
  name: "threadCreate",

  async execute(client, thread) {
    try {
      if (thread.joinable && !thread.joined) {
        await thread.join();
      }
    } catch (e) {
      console.log(String(e).grey)
    }

  }
}