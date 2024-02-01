const mailSender = require('../utils/mailSender')
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate')

async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailVerificationTemplate(otp)
        )
        // console.log(mailResponse)
        console.log("Mail sent Sucessfully!!");
    } catch (error) {
        console.log("Error while sending email :",email)
        throw error;
    }
}

module.exports = {sendVerificationEmail}
