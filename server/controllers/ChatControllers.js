const mongoose = require('mongoose')
const User = require("../models/User")
const Chat = require("../models/Chat")
const Profile = require("../models/Profile")
const { createMessage, updateMessageStatus } = require("./MessageControllers")

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        // .select('_id mobileNumber firstName lastName')

        if (!users) {
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
            success: false,
            message: `Internal server error: ${error}`
        })
    }
}

exports.sendChatMessage = async (req, res) => {
    try {

        const { senderId, receiverId, message } = req.body;

        const sentMessage = await createMessage(senderId, receiverId, message)
        console.log(sentMessage)

        const oldChats = await Chat.findOne(
            {
                $and: [
                    {
                        sender: {
                            $in: [
                                { "_id": senderId },
                                { "_id": receiverId }
                            ]
                        }
                    },
                    {
                        receiver: {
                            $in: [
                                { "_id": senderId },
                                { "_id": receiverId }
                            ]
                        }
                    }
                ]
            }
        )

        console.log("Old Chat: ", oldChats)

        // if no old chat is found we need to create a new one and push it in both the users chat
        if (oldChats.length === 0) {
            try {
                console.log("Going to create new Chat")
                let newChat = await Chat.create({
                    sender: senderId,
                    receiver: receiverId,
                    messages: sentMessage._id,
                    unseenMessages: sentMessage._id
                })
                console.log("New Chat: ", newChat)

                const Users = await User.updateMany(
                    {
                        $or: [
                            { "_id": senderId },
                            { "_id": receiverId }
                        ]
                    },
                    {
                        $push: { "Chats": newChat._id },
                    },
                    { upsert: true },
                    { multi: true },
                    { new: true }
                )

                console.log("updated Users: ", Users)

                return res.status(200).json({
                    success: true,
                    message: "New Chat Created SuccessFully!!"
                })
            } catch (error) {
                return res.status(500).json({
                    success: true,
                    message: `Internal Server Error while creating New Chat ${error}`
                })
            }
        }

        // if Old Chat was Found then we need to update it 

        const updatedChat = await Chat.findByIdAndUpdate(
            {
                _id: oldChats._id
            },
            {
                $push: { messages: sentMessage._id, unseenMessages: sentMessage._id },
            },
            { upsert: true },
            { new: true }
        )

        console.log("Updated Chat: ", updatedChat)

        return res.status(200).json({
            success: true,
            message: "Chat Updated SuccessFully!!"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error while Updating Chat: ${error}`
        })
    }
}

async function updateMessages(messages){
    let updatedMessages = []
    await messages.forEach(message => {
        updatedMessages.push(updateMessageStatus(message._id));
    });
    
}

exports.getChatMessages = async (req, res) => {
    try {

        const { senderid, receiverid } = req.params

        const { _id, messages } = await Chat.findOne(
            {
                $and: [
                    {
                        sender: {
                            $in: [
                                { "_id": senderid },
                                { "_id": receiverid }
                            ]
                        }
                    },
                    {
                        receiver: {
                            $in: [
                                { "_id": senderid },
                                { "_id": receiverid }
                            ]
                        }
                    }
                ]
            }
        ).select('_id messages')

        console.log("messages", messages)

        if (!messages) {
            return res.status(200).json({
                success: true,
                messages: "No messages in the Chat ",
                messages
            })
        }

        // update all the unseen messages status as seen and then return messages
        
        let updatedMessages = []
        await messages.forEach(message => {
            updatedMessages.push(updateMessageStatus(message._id)); 
        });

        console.log(updatedMessages)

        const updatedChat = await Chat.findOneAndUpdate(
            {
                _id: _id
            },
            {
                $unset: {unseenMessages: 1},
                "lastMessage": [messages.length - 1]
            },
            { new: true },
            { multi: true },
            { upsert: true }
        ).populate({
            path: "messages",
            model: "Message",
        })

        updatedChat.messages = updatedMessages

        updatedChat.save()

        console.log("Updated Chat ", updatedChat)

        return res.status(200).json({
            success: true,
            message: `Chat updated and sent successfully`,
            updatedChat
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in Fetching Messages : ${error}`
        })
    }
}