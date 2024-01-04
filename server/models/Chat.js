const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isGroupChat:{
        type: {
            
        }
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    unseenMessages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
},{ timestamps: true});

module.exports = mongoose.model("Chat",ChatSchema);