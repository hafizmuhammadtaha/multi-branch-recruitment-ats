const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeUrl: { type: String, required: true }, // [cite: 156, 196]
    status: { 
        type: String, 
        enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'], 
        default: 'Submitted' 
    } // [cite: 94-100]
}, { timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);