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
        // console.log("User is ",additionalInfo)
        // const {} = additionalInfo.isActive

        const isActive = additionalInfo.isActive === "offline" ? false : true;

        const createdMessage = await Message.create({
            text: message,
            sentBy: senderId,
            sentTo: receiverId,
            status: isActive ? "delivered" : "sent"   
        })

        return createdMessage
        
    } catch (error) {
        return Error(`Internal Server Error while creating message: ${error}`)
    }
}

exports.updateMessageStatus = async(unseenMessages, receiverId) => {
    try {

        const targettedMessages = await Message.updateOne(
            {_id: {$in: unseenMessages.toSting() } , sentTo:receiverId}
        )

        console.log("target message",targettedMessages)

        // const updatedMessage = await Message.findByIdAndUpdate(
        //     {_id: messageId , sentTo:receiverId },
        //     {
        //         $set: {
        //             status: "read"
        //         },
                
        //     }
        // )

        // return updatedMessage;
    } catch (error) {
        return Error(`Error while setting messages ${error}`)
    }
}