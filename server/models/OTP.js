const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender')
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate')

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

async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailVerificationTemplate(otp)
        )
        console.log("Mail sent Sucessfully!!");
    } catch (error) {
        console.log("Error while sending email :",email)
        throw error;
    }

}
// OTPschema.pre("save", async function(next) {
//     if(this.isNew){
//         console.log("sent otp is: ",this.otp)
//         await sendVerificationEmail(this.email, this.otp);
//     }
//     next();
// })


module.exports = mongoose.model("OTP",OTPschema);