const bcrypt = require("bcrypt")
const User = require("../models/OTP")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
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
        console.log(email);
        console.log(`saved OTP is ${otpBody}`)

        // sending email
        try{
            const response=await mailSender(email,"Verification OTP",otp);
        }catch(err){
            return res.status(500).json({
                success:false,
                message:"Internal Sevrer Error"
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

exports.signUp=async(req, res, next)=>{
    try {
        // Destructure fields from the request body
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        contactNumber,
        otp,
      } = req.body
    //   check if user already exsist
      if (!firstName || !lastName  || !email || !password || !confirmPassword ||  !contactNumber || !otp ){
        return res.status(403).send({
            success: false,
            message: "All Fields are required",
          })
      }
    // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                "Password and Confirm Password do not match. Please try again.",
            })
        }
    // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            })
        } 
    // find the most recent otp for this email
        const response = await OTP.find(email).sort({ createdAt: -1}).limit(1)
        console.log(response)
        console.log(response)
        if (response.length === 0) {
    // OTP not found for the email
        return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
        })
        }
    // Invalid OTP
        else if (otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        }
        
    // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

    // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            additionalDetails: profileDetails._id,
            image: "",
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