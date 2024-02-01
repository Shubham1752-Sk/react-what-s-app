const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    profilePhoto: {
        type: String
    },
    crearedAt: {
        type: Date,
        default: Date.now()
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    media: {
        type: String,
    } | null ,
    
},{ timestamps: true})

module.exports = mongoose.model("Group",groupSchema);