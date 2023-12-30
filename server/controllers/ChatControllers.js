const mongoose = require('mongoose')
const User = require("../models/User")
const Profile = require("../models/Profile")


exports.getAllUsers = async(req, res) =>{
    try {
        const users = await User.find()
        // .select('_id mobileNumber firstName lastName')
        
        if(!users){
            return res.status(400).json({
                success: false,
                message: "No Users Found in Database!!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message: `Internal server error: ${error}`
        })
    }
}