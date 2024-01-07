const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text: {
        type: String
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User'
    },
    sentTo: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['sent','read','delivered'],
        default: 'sent'
    },
    crearedAt: {
        type: Date
    },
    media: {
        type: String,
    },
    
},{ timestamps: true})

module.exports = mongoose.model("Message",messageSchema);