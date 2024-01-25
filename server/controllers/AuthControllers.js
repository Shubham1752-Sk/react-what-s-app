const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const Profile = require("../models/Profile")
const sendMail = require('../mail/sendEmail');
require('dotenv').config()

exports.sendotp = async (req, res, next) =>{
    try{
        console.log(req.body);
        const { email } = req.body;
        
        const checkIfUserAlreadyPresent = await User.findOne({ email })
        
        if( checkIfUserAlreadyPresent ){
            return res.status(409).json({ 
                success: false,
                message: "Email already registered" });
        }
        
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        
        let result = await OTP.findOne({otp});
        
        while( result ){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
            })
            
            result = await OTP.findOne({otp});
        }

        const otpBody = await OTP.create({
            email: email,
            otpCode: otp,
            otpType: 'AccountVerification',
            createdAt: Date.now()
        })
        // console.log(email);
        console.log(`saved OTP is ${otpBody}`)

        try{
            await sendMail.sendVerificationEmail(email,otpBody.otpCode);
        }catch(err){
            console.log(err)
            return res.status(500).json({
                success:false,
                message:"Internal Sevrer Error while sending Verification E-mail"
            })
        }
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })
    }
    catch(error){
        console.log("Error in OTP sending Route ",error)
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error while sending OTP"
        })
    }
}

exports.signUp = async(req, res, next)=>{
    console.log("In the signup function")
    try {
        // Destructure fields from the request body
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        mobileNumber,
        otp,
      } = req.body
    //   check if user already exsist
      if (!firstName || !email || !password || !confirmPassword ||  !mobileNumber || !otp ){
        return res.status(403).send({
            success: false,
            message: "All Fields are required",
          })
      }
    //   console.log("Requirements Matched!!")
    // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                "Password and Confirm Password do not match. Please try again.",
            })
        }
        // console.log("passwords Matched!!")
    // Check if user already exists
        const existingUser = await User.findOne({ email })
        // console.log("Existing user ",existingUser)
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            })
        } 
        
        // console.log("No existing user found!!")
    // find the most recent otp for this email
        const response = await OTP.findOne({email}).sort({ createdAt: -1}).limit(1)
        // console.log(response)
        // console.log("otp is : ",otp);
        // console.log("otpCode is : ",response.otpCode);
        
        // console.log(response)
        if (response.length === 0) {
    // OTP not found for the email
        return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
        })
        }
    // Invalid 
        else if (otp !== response.otpCode) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        }
        // console.log("hasing Passwords")
    // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

    // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
        })
        console.log(profileDetails)
        const user = await User.create({
            firstName,
            lastName,
            email,
            mobileNumber,
            password: hashedPassword,
            additionalInfo: profileDetails._id
        })
        
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
          })

    } catch (error) {
        console.log(`Internal server error while signing UP ${error}`)
        res.status(400).json({
            success: false,
            message: "User can't be registered. Please try Again."
        })
    }
}

exports.login = async ( req, res, next)=>{
    try {
        //  get email and password from request body
        const { email, password } = req.body;
        
        // check if email exists or password is null or not
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'All te fields are compulsory'
            })
        } 

        // find user with entered email
        const user = await User.findOne({email}).populate({
            path:'additionalInfo',
            model:"Profile"
        })
        
        // if no user is found with this e-mail
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'No User Found with this E-mail'
            })
        }

        // compare the given password with stored one in database
        if( await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                { email: user.email, id:user._id },
                process.env.JWT_SECRET ,
                { expiresIn:'3h' }
            )
            
            // save token to user document in Database
            user.token = token
            await user.save()
            
            await updateOnlineStatus(token, "online")

            user.password = undefined

            // set cookie for token and return success
            const options = {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "User Login Successfull !!"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            })
        }
    } catch (error) {
        console.log("Internal server error .... ",error)
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateOnlineStatus = async(token, status) =>{
    try{
        // console.log(token)
        // console.log(status)
        const { additionalInfo}= await User.findOne({token: token}).select("additionalInfo")

        // console.log(additionalInfo)
        await Profile.findByIdAndUpdate(
            {_id: additionalInfo},
            {
                $set: {"isActive" : status}
            },
            {new: true}
        )

        // console.log(updatedProfile)
    }
    catch(error){
        throw new Error(`Error while updating user Online Status ${error}`)
    }
}