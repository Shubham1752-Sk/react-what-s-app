const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    about: {
        type: String,
        default: "Hey!! I'm using Gup-Shup"
    },
    dateofJoining: {
        type: Date,
        default: Date.now()
    },
    dateOfBirth:{
        type: Date,
    },
    isActive: {
        type: String,
        enum: ["offline","online"],
        default: "offline"
    },
    gender:{
        type: String,
        enum: ['MALE','FEMALE','OTHERS']
    }
})

module.exports = mongoose.model('Profile',profileSchema);

