import toast from "react-hot-toast";
import { setLoading, setChatMessages } from "../../slices/ChatSlice";
import { apiConnector } from "../apiConnector";
import { chatEndpoints} from "../apis";
// import { createReadStream } from "fs";
// import * as fs from "node:fs"
const {
    GET_ALL_USERS,
    SEND_CHAT_MESSAGE,
    GET_CHAT_MESSAGES,
    SEND_MEDIA_MESSAGE
} = chatEndpoints;

export function getAllUsers(setUsers){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET",GET_ALL_USERS)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("Result of get All users API is: ",response.data.users)
            setUsers(response.data.users)
        } catch (error) {
            console.log("Error in Get All Users API....",error)
        } finally{
            dispatch(setLoading(false))
        }
    }
}

export function sendChatMessage(senderId, receiverId, message){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        // const {socket} = useSelector((state)=>state.chat)
        console.log(SEND_CHAT_MESSAGE)
        try {
            const response = await apiConnector('POST',SEND_CHAT_MESSAGE,{
                senderId,
                receiverId,
                message
            })
    
            if(!response.data.success){
                throw new Error(response.data.message)
            }
    
            console.log("Send Message API response .... ",response)
            // console.log(response.data.updatedChat.messages)
            // const messages = response.data.messages.messages
            // console.log(messages)

            dispatch(setChatMessages(response.data.messages.messages))
            // dispatch(getChatMessages(senderId,receiverId))
        } catch (error) {
            console.log("Error in Send Chat Message API....",error)
        }finally{
            dispatch(setLoading(false))
        }
    }
}

export function sendMediaMessage({senderId,receiverId,audiofile,url}){
    return async(dispatch)=>{
        const toasId=toast.loading("Loading..");
        
        dispatch(setLoading(true));
        console.log("sender",senderId)
        console.log("receiver",receiverId)
        console.log("file is: ",audiofile)

        try{
            const response=await apiConnector("POST",SEND_CHAT_MESSAGE,{
                senderId,
                receiverId,
                audiofile,
                url
            },{
                "Content-Type":"multipart/form-data",
                // 'Content-Type': 'application/octet-stream'
            });

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("Send media Message API response .... ",response)
            dispatch(setChatMessages(response.data.messages.messages))
        }catch(err){
            console.log(err);
        }
        dispatch(setLoading(false));
    }
}

export function getChatMessages(senderid, receiverid){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
                const response = await apiConnector('GET',`${GET_CHAT_MESSAGES}${senderid}/${receiverid}`)
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            console.log("Get Chat Messages API response .... ",response.data.messages)
            // console.log(JSON.stringify(response.data))
            // const messages = response.data.messages
            // console.log(messages)
            dispatch(setChatMessages(response.data.messages))
        } catch (error) {
            console.log("Error in Get Chat Messages API....",error)
        }finally{
            dispatch(setLoading(false))
        }
    }
}