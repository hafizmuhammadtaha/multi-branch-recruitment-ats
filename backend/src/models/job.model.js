const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { 
        type: String, 
        required: true,
        enum: ['Engineering', 'Design', 'Marketing', 'HR', 'QA', 'DevOps', 'Management', 'Finance', 'Sales', 'Support']
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    availableSeats: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Job', jobSchema);