import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    users: null,
    chatMessages: null,
}

const ChatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    reducers:{
        setLoading(state, value){
            state.loading = value.payload
        },
        setUsers(state, value){
            state.users = value.payload;
        },
        setChatMessages(state, value){
            state.chatMessages = value.payload
        }
    }
})

export const {setLoading, setUsers, setChatMessages} = ChatSlice.actions;

export default ChatSlice.reducer;