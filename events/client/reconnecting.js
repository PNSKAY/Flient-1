module.exports = {
  name: "reconnecting",

  async execute() {
    client.logger(`Reconnceting at ${new Date()}.`.bgYellow.black);
  }
}
