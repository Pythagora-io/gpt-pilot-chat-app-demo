const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
sender: String,
receiver: String,
text: String,
timestamp: Date
});

module.exports = mongoose.model('Message', messageSchema);