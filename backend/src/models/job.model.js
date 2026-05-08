const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    availableSeats: { type: Number, required: true } // [cite: 104]
}, { timestamps: true });
module.exports = mongoose.model('Job', jobSchema);