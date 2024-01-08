import React, { useEffect, useState } from 'react'
import { getChatMessages } from '../services/operations/ChatAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserContacts, getUserInfo, getuserinfo } from '../services/operations/UserAPI'
import socketIo from "socket.io-client"
import { io } from "socket.io-client";

import SearchBar from '../components/core/Chat/SearchBar'
import Spinner from "../components/common/Spinner"
import ChatDialog from '../components/core/Chat/ChatDialog'

const ENDPOINT = "http://localhost:4000/"

const Chat = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  // const [user, setUser] = useState()
  const [allUsers, setAllUsers] = useState()
  const [viewChat, setViewChat] = useState(false)
  const [chatUser, setChatUser] = useState({})
  // const [contacts, setContacts] = useState()

  const { contacts, chatMessages } = useSelector((state) => state.chat)

  // const { user } = useSelector((state)=>state.auth) 

  const { token } = useSelector((state) => state.auth)
  // const token = sessionStorage.getItem("token") ? JSON.parse()
  // const fixedToken = token;
  // console.log(fixedToken)
  // console.log(token)
  const { user } = useSelector((state) => state.chat)
  // console.log(token)

  // const socket = io(ENDPOINT);

  // const socket = io('http://localhost');

  useEffect(() => {
    if (!token) alert("no token")

    if (token) {
      console.log("getting user info")
      dispatch(getUserInfo(token))
    }

    // user && dispatch(getUserContacts(user._id, setContacts))
    // dispatch(getAllUsers(setAllUsers))

    // socket.connect()

    // io.sockets.on('connection', function(socket){
    //   console.log("new client connected");
    // });

    // socket.on('connect',()=>{
    //   console.log(socket.id)
    //   // alert("connected");
    // })

    // return()=>{
    // }

  }, [token])

  useEffect(() => {
    if (token) {

    }
  }, [token])
  console.log("contacts", contacts)

  const manageChat = (contact) => {

    // console.log("contact is ",contact)
    // setViewChat((prev)=>({
    //   ...prev,
    //   isOpened: true,
    //   chatUser: contact
    // }))

    dispatch(getChatMessages(user._id, contact._id))

    setViewChat(true)
    setChatUser(contact)

    // console.log(chatUser)
  }

  return (
    <div>
      <div className=' w-[100vw] h-[100vh] relative flex justify-start items-center mx-auto gap-4 bg-panel-bg '>
        <div className='flex flex-col relative gap-4 w-5/12 px-2 py-1 items-start h-full '>
          <SearchBar user={user} allUsers={allUsers} />
          {/* <ContactList contacts={contacts} /> */}
          {
            contacts ? (
                <div className=' w-full mt-4 flex-col bg-transparent  justify-around items-center space-y-2 px-2 py-1'>
                  {
                    contacts.map((contact) => (
                      <div className=' h-20 bg-white bg-opacity-10 rounded-xl gap-4 flex justify-start px-1 items-center border-b-[3px] hover:border-l-4 hover:border-b-8 duration-100 ease-in border-[#444f4b] hover:cursor-pointer'
                        onClick={() => manageChat(contact)} 
                        >
                        <div className='w-16 h-16 border rounded-full '>
                          <img
                            src={contact.profilePhoto}
                            alt="avatar"
                          />
                        </div>
                        <div className='flex-col '>
                          <p className='text-xl text-secondary-green'>{`${contact.firstName} ${contact.lastName}`}</p>
                          {/* <p className='text-sm text-secondary-green'>last message</p> */}
                        </div>
                      </div>
                    ))
                  }
                </div>
              
            ) : (
              <div>
                No Contacts Found!
              </div>
            )
          }
        </div>
        <div className='w-full h-full flex justify-center items-center'>
          {
            viewChat ? (
              <ChatDialog user={user} chatUser={chatUser} />
            ) : (
              <Spinner text={"Ready to do some GUP-SHUP!!"} />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Chat

// import React, { useEffect, useState } from 'react'
// import { getAllUsers } from '../services/operations/ChatAPI'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { getUserInfo } from '../services/operations/UserAPI'

// const Chat = () => {
//   const { user } = useSelector((state) => state.profile)
//   const dispatch=useDispatch();

//   const { token } = useSelector((state) => state.auth)
//   // console.log(token)
//   const { loading } = useSelector((state) => state.chat)
//   window.onload=()=>{
//     getUserInfo(token);
//   }
//   return (
//     <div>Chat</div>
//   )
// }

// export default Chat