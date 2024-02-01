import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    chatMessages: [],
    contacts: [],
    socket: null
}

const ChatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    reducers:{
        setLoading(state, value){
            state.loading = value.payload
        },
        setUser(state, value){
            state.user = value.payload;
        },
        setContacts(state, value){
            state.contacts = value.payload;
        },
        setChatMessages(state, value){
            state.chatMessages = value.payload
        },
        setSocket(state, value){
            state.socket = value.payload
        }
    }
})

export const {setLoading, setUser, setContacts, setChatMessages, setSocket} = ChatSlice.actions;

export default ChatSlice.reducer;