import React, { useEffect, useState } from 'react'
import { getChatMessages } from '../services/operations/ChatAPI'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo } from '../services/operations/UserAPI'
import socketIo from "socket.io-client"

import SearchBar from '../components/core/Chat/SearchBar'
import Spinner from "../components/common/Spinner"
import ChatDialog from '../components/core/Chat/ChatDialog'
import Contactcard from '../components/core/Chat/Contactcard'

const ENDPOINT = "http://localhost:4000/"

const Chat = () => {

  const dispatch = useDispatch();

  const [viewChat, setViewChat] = useState(false)
  const [chatUser, setChatUser] = useState({})
  const [socketID,setSocketID] = useState("")
  // const [contacts, setContacts] = useState()

  const { contacts } = useSelector((state) => state.chat)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.chat)
  // console.log(token)

    // const socket = io('http://localhost');

  useEffect(() => {
    if (!token) alert("no token")

    if (token) {
      // console.log("getting user info")
      dispatch(getUserInfo(token))
    }

  }, [])

  useEffect(()=>{
    const socket = socketIo(ENDPOINT)
    socket.on('connect',()=>{
      // console.log(socket.id)
      setSocketID(socket)
      // console.log("socket is: ",socketID)
      // alert("connected");
    })
  },[])


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
    if(socketID){
      socketID.emit('update-msg-status',{to: contact._id})
    }
    // console.log(chatUser)
  }

  return (
    <div >
      <div className=' w-[100vw] h-[100vh] relative flex justify-start items-center mx-auto gap-1 bg-panel-bg '>
        <div className='flex flex-col relative gap-4 w-5/12 px-2 py-1 items-start h-full '>
          {user && <Contactcard user={user} />}
          <div className='w-full h-full pr-2 border-r rounded-md border-white'>
          <SearchBar user={user} />
          {
            contacts ? (
                <div className=' w-full mt-1 flex-col bg-transparent  justify-around items-center space-y-2 px-1 py-1'>
                  {
                    contacts.map((contact) => (
                      <Contactcard key={contact._id} isContact={true} manageChat={manageChat} user={contact} />
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
        </div>
        <div className='w-full h-full flex justify-center items-center'>
          {
            viewChat ? (
              <ChatDialog user={user} chatUser={chatUser} socketID={socketID}/>
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
