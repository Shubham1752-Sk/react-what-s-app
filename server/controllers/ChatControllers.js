const mongoose = require('mongoose')
const User = require("../models/User")
const Chat = require("../models/Chat")
const Profile = require("../models/Profile")
const { createMessage } = require("./MessageControllers")

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

exports.sendChatMessage = async(req, res)=>{
    try {

        const { senderId, receiverId, message } = req.body;

        const sentMessage = await createMessage(senderId, receiverId, message)
        console.log(sentMessage)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error while Adding Chat: ${error}`
        })
    }
}