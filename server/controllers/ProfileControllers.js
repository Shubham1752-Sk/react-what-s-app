const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require("../models/Profile")
const {uploadToCloudinary} = require("../utils/imageUploader")

exports.getProfileDetails = async(req, res) =>{
    try {

        const{ id } = req.body;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "No user ID provided"
            })
        }

        const user = await User.findOne({_id: id})
        .populate({
            path:"additionalInfo",
            model: 'Profile'
        });
        console.log("user is: ",user)
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'No User Found with this ID'
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Found!!",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.updateProfilePicture = async(req,res)=>{
    try {
        console.log(req.files)
        const displayPicture = req.files.displayPicture
        const id = req.files.id;

        const user = await User.findById(id);

        console.log(process.env.FOLDER_NAME)
        const image = await uploadToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image);

        const updatedUser = await User.findByIdAndUpdate(
            {_id: id},
            {profilePhoto: image.secure_url}
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            updatedUser
          })
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        })
    }
}

exports.updateProfile = async(req, res) =>{
    try {
        console.log("in the controller")
        const {id, about, gender, dateofBirth, profilePhoto } = req.body;
        console.log("req.body: ",req.body)

        // console.log("req.files: ",req.files)
        // const file = req.files.imagefile; 
        
        const user = await User.findById(id);
        const profile = await Profile.findById(user.additionalInfo);

        const image = await uploadToCloudinary(
            profilePhoto,
            process.env.FOLDER_NAME,
            200,
            1000
        )
        console.log(image)
        // updating user profile image
        await User.findByIdAndUpdate(
            {_id: id},
            {profilePhoto: image.secure_url}
        )

        profile.dateOfBirth = dateofBirth;
        profile.gender = gender;
        profile.about = about;

        console.log(image)

        profile.save();

        const updatedUserDetails = await User.findById(id)
        .populate("additionalInfo")
        .exec()

        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            // error: error,
            message: ("Internal Server Error",error)
        })
    }
}