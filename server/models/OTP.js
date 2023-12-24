const mongoose = require('mongoose');

const OTPschema = new mongoose.Schema({
    email:{
        type: String,
        reuqired: true
    },
    otpCode: {
        type: String,
        reuqired: true
    },
    otpType: {
        type: String,
        enum:['AccountVerification','Login']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60 * 5
    },
});

async function sendVerificationEmail(){
    try {
        
    } catch (error) {
        console.log(`Error while sending mails: ${error}`)
    }
}

module.exports = mongoose.model("OTP",OTPschema);