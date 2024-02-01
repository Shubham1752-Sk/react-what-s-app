const mongoose = require('mongoose')
const User = require("../models/User")
const Chat = require("../models/Chat")
const Profile = require("../models/Profile")
const { createMessage, createMediaMessage } = require("./MessageControllers")
const Message = require('../models/Message')
const cloudinary=require("cloudinary").v2;
const multer=require("multer");
const {renameSync} = require("fs")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

        // console.log("req.body is: ",req.body)
        // console.log("req.files is: ",req.files)
        // console.log(req.body)
        const { senderId, receiverId, file, url, message } = req.body;

        let sentMessage
        // console.log(message)
        // console.log(url)
        // console.log(file)
        if(req.files){
            const audioFile = req.files.audiofile;
            // console.log(audioFile.data)
            const date = Date.now()
            if(req.file){
                // console.log("req.file: ",req.file)
                let filename = "uploads/recordings"+date+audioFile.name
                // console.log("filename: ",filename)
                renameSync(audioFile.tempFilePath , filename)
                
                sentMessage = await createMediaMessage(senderId, receiverId )
            }
            
        }
        // return
        // console.log(message)
        // console.log(url)
        // console.log("file is: ",file)

        // if(audioFile){

        // }
        
        if(file){
            var fileType = file.split("/")[0].split(":")[1]
            console.log(fileType)

            const messageUrl=await cloudinary.uploader.upload_large(file,{
                // upload_preset: process.env.UPLOAD_PRESET,
                folder:process.env.FOLDER_NAME ,
                resource_type: fileType === 'image' ? 'image' : "video",
            })
            // console.log("Message url is",messageUrl.secure_url);
            var imgURL = messageUrl.secure_url
        }

        
        if(message){
            sentMessage = await createMessage(senderId, receiverId, message)
            // console.log("sent msg",sentMessage)
            
        }

        if(file){
            sentMessage = await createMediaMessage(senderId, receiverId, imgURL, fileType)
            // console.log('media sent msg',sentMessage)
        }

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

        // console.log("Old Chat: ", oldChats)

        // if no old chat is found we need to create a new one and push it in both the users chat
        if (!oldChats) {
            try {
                console.log("Going to create new Chat")
                let newChat = await Chat.create({
                    sender: senderId,
                    receiver: receiverId,
                    messages: sentMessage._id,
                    unseenMessages: sentMessage._id
                })
                // console.log("New Chat: ", newChat)

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

                // console.log("updated Users: ", Users)

                return res.status(200).json({
                    success: true,
                    message: "New Chat Created SuccessFully!!",
                    messages: [sentMessage]
                })
            } catch (error) {
                return res.status(500).json({
                    success: true,
                    message: `Internal Server Error while creating New Chat ${error}`
                })
            }
        }

        // if Old Chat was Found then we need to update it 

        const updatedChat = await Chat.findOneAndUpdate(
            {
                _id: oldChats._id
            },
            {
                $push: { messages: sentMessage._id, unseenMessages: sentMessage._id },
            },
            { upsert: true },
            { new: true },
            { multi: true}
        )
        .populate({
            path: "messages",
            model: "Message",
        })
        updatedChat.save();

        const messages = await Chat.findById(oldChats._id)
        .select('messages')
        .populate({
            path: "messages",
            model: "Message",
        })

        // console.log("Updated Chat: ", updatedChat)
        // console.log(messages)

        return res.status(200).json({
            success: true,
            message: "Chat Updated SuccessFully!!",
            messages
        })
        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error while Updating Chat: ${error}`
        })
    }
}

// async function updateMessages(messages){
//     let updatedMessages = []
//     await messages.forEach(message => {
//         updatedMessages.push(updateMessageStatus(message._id));
//     });
    
// }

// exports.sendMediaMessage = async(req,res)=>{
//     try{
//         const {senderId,receiverId,file}=req.body;

//         const fileType = file.split("/")[0].split(":")[1]

//         const ImageUrl=await cloudinary.uploader.upload_large(file,{
//             // upload_preset: process.env.UPLOAD_PRESET,
//             folder:process.env.FOLDER_NAME ,
//             resource_type: fileType === 'image' ? 'image' : "video",
//         })
//         console.log("Image url is",ImageUrl.secure_url);
//         const url = Image.secure_url

//         const sentMessage = await createMediaMessage(senderId, receiverId, url)
//         console.log(sentMessage)
        
//         const oldChats = await Chat.findOne(
//             {
//                 $and: [
//                     {
//                         sender: {
//                             $in: [
//                                 { "_id": senderId },
//                                 { "_id": receiverId }
//                             ]
//                         }
//                     },
//                     {
//                         receiver: {
//                             $in: [
//                                 { "_id": senderId },
//                                 { "_id": receiverId }
//                             ]
//                         }
//                     }
//                 ]
//             }
//         )

//         if (!oldChats) {
//             try {
//                 console.log("Going to create new Chat")
//                 let newChat = await Chat.create({
//                     sender: senderId,
//                     receiver: receiverId,
//                     messages: sentMessage._id,
//                     unseenMessages: sentMessage._id
//                 })
//                 // console.log("New Chat: ", newChat)

//                 const Users = await User.updateMany(
//                     {
//                         $or: [
//                             { "_id": senderId },
//                             { "_id": receiverId }
//                         ]
//                     },
//                     {
//                         $push: { "Chats": newChat._id },
//                     },
//                     { upsert: true },
//                     { multi: true },
//                     { new: true }
//                 )

//                 // console.log("updated Users: ", Users)

//                 return res.status(200).json({
//                     success: true,
//                     message: "New Chat Created SuccessFully with media message!!",
//                     messages: sentMessage
//                 })
//             } catch (error) {
//                 return res.status(500).json({
//                     success: true,
//                     message: `Internal Server Error while creating New Chat media message ${error}`
//                 })
//             }
//         }


        
//         res.status(200).json({
//             success: true,
//             message: "Media Mesaage sent successfully!!",
//             messages
//         })
//     }catch(error){
//         return res.status(500).json({
//             success: false,
//             message: `Internal Server Error while Sending Media Message: ${error}`
//         })
//     }
// }

exports.getChatMessages = async (req, res) => {
    try {

        const { senderid, receiverid } = req.params

        // console.log(senderid)
        // console.log(receiverid)

        const chat = await Chat.findOne(
            {
                $and: [
                    {
                        sender: {
                            $in: [
                                { _id: senderid },
                                { _id: receiverid }
                            ]
                        }
                    },
                    {
                        receiver: {
                            $in: [
                                { _id: senderid },
                                { _id: receiverid }
                            ]
                        }
                    }
                ]
            }
        )

        // console.log("chat",chat)
        if (!chat)
        {
            return res.status(200).json({
                success: true,
                message: "No Chat between users"
            })
        }
        // console.log("after sending status")
        const { _id, messages, unseenMessages } = await Chat.findOne(
            {
                $and: [
                    {
                        sender: {
                            $in: [
                                { _id: senderid },
                                { _id: receiverid }
                            ]
                        }
                    },
                    {
                        receiver: {
                            $in: [
                                { _id: senderid },
                                { _id: receiverid }
                            ]
                        }
                    }
                ]
            }
        )
        .select('_id messages unseenMessages').populate({
            path: "messages",
            model: "Message",
        })
        // console.log(_id)
        // console.log("messages",messages)

        // console.log("unseen-messages", unseenMessages)

        if (messages.length === 0 || unseenMessages.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No new messages/unseen in the Chat ",
                messages
            })
        }

        // update all the unseen messages status as seen and then return messages
        // console.log("hello")
        // let updatedMessages = []
        // await unseenMessages.forEach(message => {
        //     updatedMessages.push(updateMessageStatus(message._id, senderid)); 
        // });

        // let updatedMessages = await updateMessageStatus(unseenMessages, senderid)
        // console.log("hi")

        // checking if there are messages for the sender by the receiver and if so update their status and return
        const updatedMessages = await Message.updateMany(
            {_id: {$in: unseenMessages } , sentTo:senderid},
            {
                $set: {
                    status: "read"
                }
            },
            {multi: true},
            {new: true}
        )

        // console.log("updated Messages",updatedMessages)

        if(updatedMessages.matchedCount === 0){
            return res.status(200).json({
                success: true,
                message: "No new messages in the Chat ",
                messages
            })
        }

        const updatedChat = await Chat.findOneAndUpdate(
            {
                _id: _id
            },
            {  
                //  $push: {messages: updatedMessages},
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

        // updatedChat.messages = updatedMessages

        updatedChat.save()

        // console.log("Updated Chat ", updatedChat)

        return res.status(200).json({
            success: true,
            message: `Chat updated and sent successfully`,
            messages: updatedChat.messages
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in Fetching Messages : ${error}`
        })
    }
}