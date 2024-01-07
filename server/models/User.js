const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    profilePhoto:{
        type: String,
        default: null
    },
    additionalInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    Chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }]
},{ timestamps: true})

module.exports = mongoose.model("User",userSchema);