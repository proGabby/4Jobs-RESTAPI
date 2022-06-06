const mongoose = require('mongoose')


const JobSchemea = new mongoose.Schema({
    company: {
        type: String,
        required: [true,'please provide company name'],
        maxlength: 25
    },
    position: {
        type: String,
        required: [true,'please provide position'],
        maxlength: 100,
    },
    status:{
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Types.ObjectId, //attaching each job to user
        ref: 'user',
        required: [true, 'please provide user']
    }
},{timestamps:true} //ensure createdat and updateat prop. is by default
)

module.exports = mongoose.model('Jobs', JobSchemea)