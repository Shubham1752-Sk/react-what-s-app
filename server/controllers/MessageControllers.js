const mongoose = require('mongoose')
const User = require("../models/User")
const Chat = require("../models/Chat")
const Profile = require("../models/Profile")
const Message = require("../models/Message")

exports.createMessage = async(senderId, receiverId, message)=>{
    try {
        const id =(new mongoose.Types.ObjectId(receiverId));
        
        const {additionalInfo} =await User.findById(id)
        .select("additionalInfo")
        .populate({
            path:"additionalInfo",
            model: 'Profile'
        })
        console.log("User is ",additionalInfo)
        // const {} = additionalInfo.isActive

        const createdMessage = await Message.create({
            text: message,
            sentBy: senderId,
            sentTo: receiverId,
            status: {
                
            }
        })
        
    } catch (error) {
        return Error(`Internal Server Error while creating message: ${error}`)
    }
}