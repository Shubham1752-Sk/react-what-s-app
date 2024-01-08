import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setLoading, setToken, } from "../../slices/authSlice";
import { setUser } from "../../slices/ChatSlice"
import { authEndpoints } from "../apis"
import image from "../../assets/default_avatar.png"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
} = authEndpoints ;


export function sendotp({email, navigate}){
    
    return async (dispatch) =>{
        const toastId = toast.loading("loading...")
        dispatch(setLoading(true))
        try {
            console.log(`Send Otp Base url is ${SENDOTP_API}`)
            const response = await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent: true
            })
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("OTP sent successfully")
            navigate('/verify-email')

        } catch (error) {
            console.log("SENDOTP API error ",error)
            toast.error("Could not send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function signUp(
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    confirmPassword,
    otp,
    navigate
  ) {
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        console.log("signup API :",SIGNUP_API)
        try {
            const response = await apiConnector("POST",SIGNUP_API,{
                firstName,
                lastName,
                email,
                mobileNumber,
                password,
                confirmPassword,
                otp,
            })
            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate(`/create-profile/${response.data.user._id}`)
        } catch (error) {
           console.log("Error in SIGNUP API :", error)
           console.log("Signup Failed!!")
           navigate('/signup') 
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate){
    return async(dispatch)=>{
        const toastId = toast.loading('Loading...')
        dispatch(setLoading(true));
        try {
            const result = await apiConnector('POST', LOGIN_API,{
                email, 
                password
            })
            console.log('LOGIN API RESPONSE ......... ', JSON.stringify(result))
            toast.success("Login Succcessfull ")
            dispatch(setToken(result.data.token))
            const userImage = result.data?.user?.profilePhoto
            ? result.data.user.image
            : image
            // `https://api.dicebear.com/5.x/initials/svg?seed=${result.data.user.firstName} ${result.data.user.lastName}`
            dispatch(setUser({ ...result.data.user, profilePhoto: userImage }))
            sessionStorage.setItem("token",JSON.stringify(result.data.token))
            // localStorage.setItem("token",JSON.stringify(result.data.token))
            navigate("/chat")
        } catch (error) {
          console.log("LOGIN API ERROR............", error)
          toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}