import React, { useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import "./chat.css"

const ChatDialog = ({ chatUser }) => {

    const [viewEmoji, setViewEmoji] = useState(false)
    const [message,setMessage] = useState("")

    const appendEmojiToMesaage = (emoji) => {
        var inputField = document.getElementById('message');
        inputField.value += emoji.emoji
    }

    const sendMessage = () =>{
        if(message.length === 0)
            return;

        alert(message)
        // dispatch(sendMessage(user._id,chatUser._id,message))
        setMessage("")
    }

    console.log(chatUser)

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
                        <p className='text-base text-secondary-green'>online/offline</p>
                    </div>
                </div>
                <div className='w-1/12 h-[90%] flex justify-center items-center'>
                    <button title='Say Hi!!' className='w-fit hover:p-3 hover:text-3xl hover:animate-ping duration-75 ease-in text-white text-4xl'>
                        👋
                    </button>
                </div>
            </div>
            <div className='w-full h-[80%] bg-chat-background bg-fixed bg-opacity-5 z-50'>
                <div className={`fixed z-20 ${viewEmoji ? "top-[30%] block w-fit h-full " : "top-[95%]  w-0 h-0 p-10 "} duration-500 ease-in-out bottom-1 `}>
                    <EmojiPicker onEmojiClick={(emoji) => appendEmojiToMesaage(emoji)} />
                </div>
            </div>
            <div className='w-full flex justify-around items-center gap-2'>
                <div className='w-2/12 h-full bg-black bg-opacity-15 gap-4 flex justify-center items-center'>
                    <button className='w-fit p-2 bg-transparent hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-full hover:p-3 hover:text-2xl duration-75 ease-in text-white text-3xl'>
                        <GrAttachment />
                    </button>
                    <button className='w-fit z-40 p-2 bg-transparent hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-full hover:p-3 hover:text-xl duration-75 ease-in text-white text-3xl'
                        onClick={() => setViewEmoji((prev) => !prev)}
                    >
                        😊
                    </button>
                </div>
                <input 
                    name="message" 
                    id="message" 
                    placeholder="Type a Message...." 
                    className=' w-full h-12  outline-none border-none bg-transparent bg-white bg-opacity-15 px-2 text-sm sm:text-base sm:px-4 md:text-lg lg:text-xl xl:text-2xl rounded-md text-secondary-green placeholder:text-secondary-green '
                    onChange={(e)=>setMessage(e.target.value)}
                    value={message}
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