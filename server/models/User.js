const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePhoto: {
        type: String,
    },
    about: {
        type: String,
        required: true,
    },
    dateofJoining: {
        type: Date,
        default: Date.now()
    },
    lastActive: {
        type: Date
    },
    token: {
        type: String
    },
    otps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OTP'
    }],  
    isActive: {
        type: String,
        enum: ["offline","online"],
        default: "offline"
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }]
},{ timestamps: true})

module.exports = mongoose.model("User",userSchema);