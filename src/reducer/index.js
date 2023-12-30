import { combineReducers } from "redux";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/ProfileSlice"
import ChatSlice from "../slices/ChatSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    chat: ChatSlice
})

export default rootReducer;