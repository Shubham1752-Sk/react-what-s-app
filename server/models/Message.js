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
    isRead: {
        type: Boolean,
        default: false
    },
    crearedAt: {
        type: Date
    },
    media: {
        type: String,
    } | null ,
    
},{ timestamps: true})

module.exports = mongoose.model("Message",messageSchema);