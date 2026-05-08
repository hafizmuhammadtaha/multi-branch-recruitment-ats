const mongoose = require('mongoose');
const branchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Islamabad, Lahore, Karachi, Remote [cite: 123-129]
}, { timestamps: true });
module.exports = mongoose.model('Branch', branchSchema);