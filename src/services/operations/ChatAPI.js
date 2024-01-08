import { setLoading, setChatMessages } from "../../slices/ChatSlice";
import { apiConnector } from "../apiConnector";
import { chatEndpoints} from "../apis";

const {
    GET_ALL_USERS,
    SEND_CHAT_MESSAGE,
    GET_CHAT_MESSAGES
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
            const messages = response.data.messages.messages
            console.log(messages)

            dispatch(setChatMessages(response.data.messages.messages))
            // dispatch(getChatMessages(senderId,receiverId))
        } catch (error) {
            console.log("Error in Send Chat Message API....",error)
        }finally{
            dispatch(setLoading(false))
        }
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
            console.log(JSON.stringify(response.data))
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