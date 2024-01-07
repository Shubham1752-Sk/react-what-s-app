import React, { useEffect, useState } from 'react'
import { getAllUsers } from '../services/operations/ChatAPI'
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

  const [user, setUser] = useState()
  const [allUsers, setAllUsers]=useState()
  const [viewChat, setViewChat] = useState(false)
  const [chatUser, setChatUser] = useState({})
  const [contacts, setContacts] = useState()
  // const { user } = useSelector((state)=>state.profile) 


  const { token } = useSelector((state) => state.auth)
  // console.log(token)
  const { loading } = useSelector((state) => state.chat)
  // console.log(loading)

  // const socket = io(ENDPOINT);

  // const socket = io('http://localhost');

  useEffect(() => {
    if (!token) return navigate('/')

    dispatch(getUserInfo(token, setUser, setContacts))
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

  }, [])

  const manageChat = (contact) =>{
  
    console.log("contact is ",contact)
    // setViewChat((prev)=>({
    //   ...prev,
    //   isOpened: true,
    //   chatUser: contact
    // }))

    setViewChat(true)
    setChatUser(contact)

    console.log(chatUser)
  }

  return (
    <div>
          <div className=' w-[100vw] h-[100vh] relative flex justify-start items-center mx-auto gap-4 bg-panel-bg '>
            <div className='flex flex-col relative gap-4 w-5/12 px-2 py-1 items-start h-full '>
              <SearchBar user={user} allUsers={allUsers} />
              {/* <ContactList contacts={contacts} /> */}
              {
                contacts ? (
                  <div className='w-full mt-4 h-16 flex-col bg-[#8a8a8f63] border-b border-[#c8a3a3] justify-around items-center gap-10 px-2 py-1'>
                    {
                      contacts.map((contact) => (
                        <div key={contact._id} className=' w-11/12 h-full flex gap-4 hover:cursor-pointer active:bg-transparent'
                        onClick={()=>manageChat(contact)}
                        >
                          <div className='w-12 h-12 border rounded-full '>
                            <img
                              src={contact.profilePhoto}
                              alt="avatar"
                            />
                          </div>
                          <div className='flex-col '>
                            <p className='text-lg text-secondary-green'>{`${contact.firstName} ${contact.lastName}`}</p>
                            <p className='text-sm text-secondary-green'>last message</p>
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