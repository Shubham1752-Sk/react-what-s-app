// require("dotenv").config()
// const dotenv = require('dotenv')
// dotenv.config()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const authEndpoints = {
    SENDOTP_API: BASE_URL + "/api/v1/auth/sendotp",
    SIGNUP_API: BASE_URL + "/api/v1/auth/signup",
    LOGIN_API: BASE_URL + "/api/v1/auth/login"
}


export const profileEndpoints = {
    PROFILE_DETAILS: BASE_URL + '/api/v1/profile/getprofiledetails',
    UPDATE_PROFILE_PICTURE: BASE_URL + '/api/v1/profile/updateprofilepicture',
    UPDATE_PROFILE: BASE_URL + '/api/v1/profile/updateprofile',
}

export const chatEndpoints ={
    GET_ALL_USERS: "/api/v1/chat/getallusers",
}