import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setLoading } from "../../slices/ProfileSlice";
import { profileEndpoints } from "../apis";

const {
    PROFILE_DETAILS,
    UPDATE_PROFILE_PICTURE,
    UPDATE_PROFILE
} = profileEndpoints ;

export function getProfileDetails( id, setUser){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST",PROFILE_DETAILS,{
                id
            })
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            console.log("response of getdetails id : ",response)
            setUser(response.data.user)
            dispatch(setLoading(false))
        } catch (error) {
            console.log("Error in get profile details API....",error)
        }
        finally{
            dispatch(setLoading(false))
        }
    }
}

export function updateProfile(id,about, gender, dateOfBirth, profilePhoto, dispatch, navigate){
    return async (dispatch)=>{
        dispatch(setLoading(true))
        // console.log(UPDATE_PROFILE)
        try {
            const response = await apiConnector("POST",UPDATE_PROFILE,{
                id,
                about,
                gender,
                dateOfBirth,
                profilePhoto
            })
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            console.log("Profile Updated sucessfully !!")
            navigate("/login")
        } catch (error) {
            console.log("Error in update profile API....",error)
        }
        finally{
            dispatch(setLoading(false))
        }
    }
}

export function updateProfilePicture(formData){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("PUT",UPDATE_PROFILE_PICTURE,{
                formData
            },{
                "Content-Type": "multipart/form-data"
            })

            console.log(
                "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
                response
              )
        
              if (!response.data.success) {
                throw new Error(response.data.message)
              }
        } catch (error) {
            console.log("update profile picture API ERROR............", error)
        } finally{
            dispatch(setLoading(false))
        }
    }
}