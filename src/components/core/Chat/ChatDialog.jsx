import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages, sendChatMessage } from '../../../services/operations/ChatAPI';
import { RiCheckDoubleFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
// import { setSocket } from '../../../slices/ChatSlice';

const ChatDialog = ({ user, chatUser }) => {

    const [viewEmoji, setViewEmoji] = useState(false)
    const [message, setMessage] = useState("")
    const [socketEvent, setSocketEvent] = useState(false)
    const dispatch = useDispatch()
    // const socket = useRef()
    // const socket = io("http://localhost:4000/");

    const appendEmojiToMesaage = (emoji) => {
        // var inputField = document.getElementById('message');
        // inputField.value += emoji.emoji
        setMessage((prev) => prev += emoji.emoji)
    }

    const sendMessage = () => {
        if(message.length === 0)
            return;

        // alert(message)
        // socket.emit("send-msg", {
        //     to: chatUser._id,
        //     from: user._id,
        //     message: message
        // })
        dispatch(sendChatMessage(user._id, chatUser._id, message))
        // console.log("Getting chat messages and setting them")
        // dispatch(getChatMessages(user._id, chatUser._id))
        // console.log("got chat messages")
        setMessage("")
    }

    const { loading, chatMessages } = useSelector((state) => state.chat)

    useEffect(() => {
        if (user) {
            // socket.current = io(`${process.env.REACT_APP_BASE_URL}/`)
            // socket.current.emit("add-user",user._id);
            // dispatch(setSocket(socket))
            // socket.on("connect", () => {
            //     console.log(socket.id, user._id)
            //     socket.emit("add-user", {
            //         id: user._id
            //     })
            // })
            // socket.emit("joined", user)

            return () => {

            }
        }
    }, [user])

    // useEffect(()=>{
    //     if(socket.current && !socketEvent){
    //         socket.current.on("msg-received",(data)=>{
    //             dispatch(getChatMessages(user._id,chatUser._id))
    //         })
    //     }
    // },[socket])

    const getDate = (date) => {
        const d = new Date(date).toLocaleTimeString().split(" ")
        const hr = d[0].split(":")[0]
        const min = d[0].split(":")[1]
        // console.log(`${hr}:${min} ${d[1]}`)
        return (`${hr}:${min} ${d[1]}`)
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.id !== "emoji-picker") {
                if (viewEmoji) {
                    setViewEmoji(false)
                }
            }
        }
    })

    console.log(chatMessages)

    return (
        <div className='w-full h-full flex-col justify-center items-center '>
            <div className='w-full h-18 flex gap-8 px-4 py-2 justify-between items-center bg-white bg-opacity-15'>
                <div className='flex  gap-8 items-center'>
                    <div className='w-16 h-16 border rounded-full '>
                        <img
                            src="/default-avatar.png"
                            alt="avatar"
                        />
                    </div>
                    <div className='flex-col '>
                        {/* <p className='text-lg text-secondary-green'>{`${contact.firstName} ${contact.lastName}`}</p> */}
                        <p className='text-lg text-secondary-green'>{chatUser.firstName} {chatUser?.lastName}</p>
                        <p className='text-base text-secondary-green'>{chatUser.additionalInfo.isActive}</p>
                    </div>
                </div>
                {/* <div className='w-1/12 h-[90%] flex justify-center items-center'>
                    <button title='Say Hi!!' className='w-fit hover:p-3 hover:text-3xl hover:animate-ping duration-75 ease-in text-white text-4xl'>
                        👋
                    </button>
                </div> */}
            </div>
            <div className='w-full h-[80%] bg-chat-background bg-fixed bg-opacity-5 z-50'>
                <div className={`fixed z-20 ${viewEmoji ? "top-[30%] block w-fit h-full " : "top-[95%]  w-0 h-0 p-10 "} duration-500 ease-in-out bottom-1 `}>
                    <EmojiPicker onEmojiClick={(emoji) => appendEmojiToMesaage(emoji)} />
                </div>
                {
                    !chatMessages ? (
                        <div className='w-full h-full flex justify-center items-center'
                            onClick={()=>{setMessage("Hi 👋");sendMessage() }}
                        >
                            <p className='w-fit h-4 text-lg text-[#e5eae5]'>Start a New Chat</p>
                            <div className='w-1/12 flex justify-center items-center animate-bounce hover:cursor-pointer'>
                                <button title='Say Hi!!' className='w-fit hover:p-3 hover:text-3xl hover:animate-ping duration-75 ease-in text-white text-4xl animate-pulse'>
                                    👋
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='h-full w-full overflow-y-scroll '>
                            {
                                chatMessages.map((message) => {
                                    return (
                                        <div key={message._id}
                                            className={` flex items-center ${message.sentBy === user._id ? "justify-end" : "justify-start"} px-2 py-1 rounded-md m-2 box-border `}>
                                            <div className={`w-auto h-full ${message.sentBy === user._id ? "bg-[#10361b]" : "bg-[#3e413e]"}  px-2 py-1 flex gap-2 text-base`}>
                                                <div className='text-[#f1f8f2]'>
                                                    {message.text}
                                                </div>
                                                <div className={` ${message.sentBy === user._id ? "w-[4.5rem]" : "w-13"} h-full flex gap-1 items-end text-end mt-4 text-xs text-gray-400`}>
                                                    <p>{getDate(message.createdAt)}</p>
                                                    {
                                                        message.status === 'sent' ? (
                                                            <div className={`${message.sentBy === user._id ? "block" : "hidden"}`}><IoMdCheckmark /></div>
                                                        ) : (
                                                            <div className={`${message.status === "read" ? "text-blue-500" : "text-[#4a4a4c]"} ${message.sentBy === user._id ? "block" : "hidden"} `}><RiCheckDoubleFill /></div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
            <div className='w-full flex justify-around items-center gap-2'>
                <div className='w-2/12 h-full bg-black bg-opacity-15 gap-4 flex justify-center items-center'>
                    <button className='w-fit p-2 bg-transparent hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-full hover:p-3 hover:text-2xl duration-75 ease-in text-white text-3xl'>
                        <GrAttachment />
                    </button>
                    <button className='w-fit z-40 p-2 bg-transparent hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-full hover:p-3 hover:text-xl duration-75 ease-in text-white text-3xl'
                        onClick={() => setViewEmoji((prev) => !prev)}
                        id="emoji-picker"
                    >
                        😊
                    </button>
                </div>
                <input
                    name="message"
                    id="message"
                    placeholder="Type a Message...."
                    className=' w-full h-12  outline-none border-none bg-transparent bg-white bg-opacity-15 px-2 text-sm sm:text-base sm:px-4 md:text-lg lg:text-xl xl:text-2xl rounded-md text-secondary-green placeholder:text-secondary-green '
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className='w-fit z-40 p-2 bg-black bg-opacity-15 hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-sm hover:p-3 hover:text-xl duration-75 ease-in text-white text-3xl'
                    onClick={sendMessage}
                >
                    <IoIosSend />
                </button>
            </div>
        </div>
    )
}

export default ChatDialog