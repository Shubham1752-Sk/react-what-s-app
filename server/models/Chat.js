const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }],
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{ timestamps: true});

module.exports = mongoose.model("Chat",ChatSchema);