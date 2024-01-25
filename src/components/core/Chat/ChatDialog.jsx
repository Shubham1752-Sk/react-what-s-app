import React, { memo, useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages, sendChatMessage, sendMediaMessage } from '../../../services/operations/ChatAPI';
import ChatMessage from './ChatMessage';
import { IoClose } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import RecordAudio from './RecordAudio';
// import { setSocket } from '../../../slices/ChatSlice';

const ChatDialog = memo(function ChatDialog({ user, chatUser, socketID }) {
    const [viewEmoji, setViewEmoji] = useState(false)
    const [message, setMessage] = useState("")
    const [viewDoc, setViewDoc] = useState(false)
    const [media, setMedia] = useState("")
    const [hoverdCard, setHoverdCard] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [recordAudio, setrecordAudio] = useState(false)

    console.log(media)
    // const [socketEvent, setSocketEvent] = useState(false)
    console.log("in the Chat Dialoag socket: ", socketID)
    const dispatch = useDispatch()
    const docRef = useRef()
    const chatContainerRef = useRef(null)
    // const socket = io("http://localhost:4000/");

    const appendEmojiToMesaage = (emoji) => {
        setMessage((prev) => prev += emoji.emoji)
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      };

    function handleMedia(e) {
        setViewDoc(true)
        console.log(media)
        const file2 = e.target.files[0];
        const reader = new FileReader()
        reader.readAsDataURL(file2);
        reader.onload = () => {
            console.log(reader);
            setMedia(reader.result);
        }
        console.log(media)
    }

    const sendMessage = () => {
        if (media) {
            alert("media msg")
            dispatch(sendMediaMessage({
                senderId: user._id,
                receiverId: chatUser._id,
                file: media
            }))

            if (socketID) {
                socketID.emit('send-msg', {
                    from: user._id,
                    to: chatUser._id,
                    message: "MEDIA MESSAGE"
                })
            }

            setMedia(null)
            setViewDoc(false)
            // console.log(media)
            return
        }
        if (message.length === 0)
            return;

        dispatch(sendChatMessage(user._id, chatUser._id, message))
        if (socketID) {
            socketID.emit('send-msg', {
                from: user._id,
                to: chatUser._id,
                message: message
            })
            scrollToBottom()
            // dispatch(getChatMessages(user._id, chatUser._id))
        }
        setMessage("")
        setIsTyping(false)
    }


    const { chatMessages } = useSelector((state) => state.chat)

    const handleInputField = (e) => {
        setMessage(e.target.value)
        setIsTyping(true)
        console.log("message", message)
        // console.log(message.length)
        if (e.target.value.length <= 0) {
            setIsTyping(false)
        }
    }

    const handleOutsideClick = (event) => {
        if (event.target.id !== "emoji-picker") {
            if (viewEmoji) {
                setViewEmoji(false)
            }
            if (setViewDoc) {
                setViewDoc(false)
            }
        }
    }

    // console.log(chatMessages)


    useEffect(() => {
        scrollToBottom()
        if (socketID) {
            socketID.emit('joined', { user })
            socketID.on('msg-received', (data) => {
                alert(`msg from ${data.from}`)
                if (chatUser._id === data.from) {
                    dispatch(getChatMessages(user._id, chatUser._id))
                    socketID.emit('update-msg-status', {
                        to: data.from
                    })
                }
                else {
                    alert(`msg from ${data.from} for you`)
                }
            })
            socketID.on('msg-seen', () => {
                alert("ur msgs have been read")
                dispatch(getChatMessages(user._id, chatUser._id))
            })
        }

        return () => {

        }
    }, [])

    return (
        <div className='w-full h-full flex-col justify-center items-center ' onClick={handleOutsideClick}>
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
                            onClick={() => { setMessage("Hi 👋"); setIsTyping(true); sendMessage() }}
                        >
                            <p className='w-fit h-4 text-lg text-[#e5eae5]'>Start a New Chat</p>
                            <div className='w-1/12 flex justify-center items-center animate-bounce hover:cursor-pointer'>
                                <button title='Say Hi!!' className='w-fit hover:p-3 hover:text-3xl hover:animate-ping duration-75 ease-in text-white text-4xl animate-pulse'>
                                    👋
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div ref={chatContainerRef} className='h-full w-full overflow-y-scroll '>
                            {
                                chatMessages.map((message) => {
                                    return (
                                        <ChatMessage
                                            key={message._id}
                                            message={message}
                                            user={user}
                                            isHovered={hoverdCard === message._id}
                                            setHovered={() => setHoverdCard(message._id)}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                }
                {
                    viewDoc && (
                        <div className='absolute w-fit flex-col box-border justify-center items-center max-w-[400px] h-fit max-h-[40%] bottom-20 p-2 rounded-lg bg-[#10361b]'>
                            <div className='w-full  py-1 px-2 box-border justify-end flex '>
                                <button className=' '
                                    onClick={() => {
                                        if (viewDoc) {
                                            setViewDoc(false)
                                        }
                                        if (media) {
                                            setMedia("")
                                            console.log(media)
                                        }
                                    }}
                                >
                                    <IoClose className='text-2xl text-white' />
                                </button>
                            </div>
                            {
                                media && docRef.current.files[0].type === "image/png" ? (
                                    <div className='w-full h-full'>
                                        <img src={media} className='' alt="img" />
                                    </div>
                                ) : (
                                    <div>
                                        <video width="750" height="500"  >
                                            <source src={media} type="video/mp4" />
                                        </video>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            {
                !recordAudio && (
                    <div className='w-full flex justify-around items-center gap-2 mt-3'>
                        <div className='w-2/12 h-full bg-black bg-opacity-15 gap-4 flex justify-center items-center'>
                            <button className='w-fit p-2 bg-transparent hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-full hover:p-3 hover:text-2xl duration-75 ease-in text-white text-3xl'>
                                <GrAttachment onClick={() => docRef.current.click()} />
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
                            onChange={(e) => handleInputField(e)}
                        />
                        <input
                            ref={docRef}
                            type='file'
                            className='hidden'
                            onChange={(e) => handleMedia(e)}
                        // onClick={()=>setViewDoc((prev)=>!prev)}
                        />
                        {

                            <button className='w-fit z-40 p-2 bg-black bg-opacity-15 hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-sm hover:p-3 hover:text-xl duration-75 ease-in text-white text-3xl'>
                                {
                                    isTyping || media ? <IoIosSend onClick={sendMessage} /> : <FaMicrophone onClick={() => setrecordAudio(true)} />
                                }
                            </button>
                        }
                    </div>
                )
            }
            {
                recordAudio && <RecordAudio setrecordAudio={setrecordAudio} userId={user._id} chatUserId={chatUser._id} />
            }
        </div>
    )
});

export default ChatDialog