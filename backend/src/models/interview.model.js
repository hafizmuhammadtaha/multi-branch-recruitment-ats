const mongoose = require('mongoose');
const interviewSchema = new mongoose.Schema({
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    date: { type: Date, required: true }, // [cite: 113]
    time: { type: String, required: true }, // [cite: 113]
    message: { type: String } // [cite: 114]
}, { timestamps: true });
module.exports = mongoose.model('Interview', interviewSchema);