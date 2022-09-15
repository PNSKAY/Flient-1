const simplydjs = require('simply-djs')

  module.exports = {
  name: 'calculator',
  aliases: ['calc', 'calculate', 'math'],
  usage: '',
  description: 'Calculator!',
  category: "utility",
  cooldown: 0,
  userPermissions: "",
  botPermissions: "",
  ownerOnly: false,
  toggleOff: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

  
  run: async (client, message, args) => {
  simplydjs.calculator(message, {
      embedColor: '#075FFF', //default: #075FFF
    })
  }
}
