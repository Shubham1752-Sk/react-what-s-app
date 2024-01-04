import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../slices/ProfileSlice"
import { setLoading } from "../../slices/ChatSlice";
import { userEndpoints } from "../apis";

const {
    GET_USER_FROM_TOKEN,
    ADD_TO_CONTACTS,
    GET_USER_CONTACTS
} = userEndpoints;

export  function getUserInfo(token,setUser, setContacts){
    return async(dispatch)=>{
        console.log("in the api")
        dispatch(setLoading(true))
        // console.log(`${GET_USER_FROM_TOKEN}${token}`)
        try {
            const response = await apiConnector('GET',`${GET_USER_FROM_TOKEN}${token}`)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("user info: ", response.data);
            setUser({...response.data.user})
            console.log("user Data set..")
            dispatch(setLoading(false))
            setContacts(response.data.user.contacts)
        } catch (error) {
            console.log("Error in Get User Info API.... ", error)
        } finally{
            dispatch(setLoading(false))
        }
    }
}

export  function getUserContacts(id,setContacts){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
            const response = await apiConnector('GET',`${GET_USER_CONTACTS}${id}`)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("user info: ", response.data);
            setContacts(response.data.contacts.contacts)
            dispatch(setLoading(false));
        } catch (error) {
            console.log("Error in Get User Contacts API.... ", error)
        } finally{
            dispatch(setLoading(false))
        }
    }
}

export function addToContacts(id, contactId, dispatch){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
            const response = await apiConnector('POST',ADD_TO_CONTACTS,{
                id,
                contactId
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("user info: ", response.data);
            setUser(...response.data.updatedUser)
        } catch (error) {
            console.log("Error in Add To Contacts API.... ", error)
        } finally{
            dispatch(setLoading(false))
        }
    }
}