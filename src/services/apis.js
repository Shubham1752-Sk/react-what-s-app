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
    UPDATE_PROFILE_PICTURE: BASE_URL + '/api/v1/profile/updateprofilepicture',
    PROFILE_DETAILS: BASE_URL + '/api/v1/profile/getprofiledetails',
    UPDATE_PROFILE: BASE_URL + '/api/v1/profile/updateprofile',
}

export const chatEndpoints ={
    GET_CHAT_MESSAGES: BASE_URL + '/api/v1/chat/getchatmessages/',
    SEND_CHAT_MESSAGE: BASE_URL + "/api/v1/chat/sendchatmessage",
    SEND_MEDIA_MESSAGE: BASE_URL + "/api/v1/chat/sendmediamessage",
    GET_ALL_USERS:BASE_URL+ "/api/v1/chat/getallusers",
}

export const userEndpoints={
    GET_USER_FROM_TOKEN: BASE_URL + "/api/v1/user/getuserinfo/",
    GET_USER_CONTACTS: BASE_URL + "/api/v1/user/fetchcontacts/",
    ADD_TO_CONTACTS: BASE_URL + "/api/v1/user/addtocontacts",
    
}