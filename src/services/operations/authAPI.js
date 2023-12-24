import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setLoading, setToken } from "../../slices/authSlice";
import { authEndpoints } from "../apis"
import { useSelector } from "react-redux";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
} = authEndpoints ;


// const {signupData} = useSelector((state)=> state.auth );
//     console.log("SignupDtaa is : ",signupData)
//     const email = signupData.email;

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
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
  ) {
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST",SIGNUP_API,{
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })
            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        } catch (error) {
           console.log("Error in SIGNUP API :", error)
           console.log("Signup Failed!!")
           navigate('/signup') 
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}