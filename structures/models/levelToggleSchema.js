const mongoose = require('mongoose');

const levelToggleSchema = new mongoose.Schema({
    guildId: String,
    toggle: Number,
});

module.exports = new mongoose.model('levelToggle', levelToggleSchema);