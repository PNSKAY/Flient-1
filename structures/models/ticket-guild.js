const {
    Schema,
    model
} = require('mongoose');

const Tickets = new Schema({
    guildID: String,
    index: Number,
    CategoryID: String,
    // Closed_CategoryID: String,
    Transcript: String,
    OpenDescription: String, 
    Role1: String,
    Role2: String,
    Role3: String
})

module.exports = model("ticket-guild", Tickets);