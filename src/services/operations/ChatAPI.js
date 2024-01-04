import { setLoading, setUsers } from "../../slices/ChatSlice";
import { apiConnector } from "../apiConnector";
import { chatEndpoints} from "../apis";

const {
    GET_ALL_USERS,
    SEND_CHAT_MESSAGE
} = chatEndpoints;

export function getAllUsers(){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET",GET_ALL_USERS)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            // console.log("Result of get All users API is: ",response.data.users)
            dispatch(setUsers(response.data.users))
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
    
        } catch (error) {
            console.log("Error in Send Chat Message API....",error)
        }
    }
}