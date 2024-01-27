import React, { memo, useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { IoIosSend, IoMdCall, IoMdMenu, IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages, sendChatMessage, sendMediaMessage } from '../../../services/operations/ChatAPI';
import { IoClose } from "react-icons/io5";
import { FaMicrophone, FaSearch , FaVideo } from "react-icons/fa";
import defaultAvatar from  "../../../assets/default_avatar.png"
import ChatBg from  "../../../assets/chat-bg.png"
import RecordAudio from './RecordAudio';
import EmojiPicker from 'emoji-picker-react';
import ChatMessage from './ChatMessage';
import SearchMessages from './SearchMessages';
// import { setSocket } from '../../../slices/ChatSlice';

const ChatDialog = memo(function ChatDialog({ user, chatUser, socketID }) {
    const [viewEmoji, setViewEmoji] = useState(false)
    const [message, setMessage] = useState("")
    const [viewDoc, setViewDoc] = useState(false)
    const [media, setMedia] = useState("")
    const [hoverdCard, setHoverdCard] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [recordAudio, setrecordAudio] = useState(false)
    const [menuActive, setMenuActive] = useState(false)
    const [height, setHeight] = useState(0)
    const [viewSearchMessages, setViewSearchMessages] = useState(false)
    console.log(chatUser)
    // const [socketEvent, setSocketEvent] = useState(false)

    const dispatch = useDispatch()
    const docRef = useRef()
    const chatContainerRef = useRef(null)
    const menuRef = useRef(null);

    const appendEmojiToMesaage = (emoji) => {
        setMessage((prev) => prev += emoji.emoji)
        setIsTyping(true)
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
        console.log("in the Chat Dialoag socket: ", socketID)
        scrollToBottom()
        
        if(socketID){
            socketID.on('msg-received',(data)=>{
                // console.log(`Current Chat user is: ${chatUser._id}`)
                if(data.from === chatUser._id){
                    console.log("new msg received from server : ", data.from);
                    dispatch(getChatMessages(user._id, chatUser._id))
                    socketID.emit('update-msg-status',{to: data.from})
                }
                else{
                    console.log("new msg received from server : ", data.from, " bt u r in another chat");
                }
            })
    
            socketID.on('msg-seen', (data) => {
                console.log("ur msgs have been read")
                console.log(data)
                console.log(chatUser._id)
                if( data.from === chatUser._id){
                    console.log("u r in chat")
                    dispatch(getChatMessages(user._id, chatUser._id))
                }
            })
        }

        return () => {

        }
    }, [])

    useEffect(()=>{
        setHeight(
            menuActive ? menuRef.current.scrollHeight : 0
        )
    },[menuActive])

    useEffect(()=>{
        scrollToBottom()
    },[chatMessages, chatUser])

    useEffect(()=>{
        console.log(viewDoc)
    },[viewSearchMessages])

    return (
        <div className='w-full h-full flex-col justify-center items-center ' onClick={handleOutsideClick}>
            <div className='w-full h-18 flex gap-8 px-4 py-2 justify-between items-center bg-white bg-opacity-15'>
                <div className='flex  gap-8 items-center'>
                    <div className='max-w-16 h-16 border rounded-full '>
                        <img
                            src={chatUser?.profilePhoto || defaultAvatar}
                            alt="avatar"
                            className='w-full h-full rounded-full p-0.5'
                        />
                    </div>
                    <div className='flex-col '>
                        {/* <p className='text-lg text-secondary-green'>{`${contact.firstName} ${contact.lastName}`}</p> */}
                        <p className='text-lg text-secondary-green'>{chatUser.firstName} {chatUser?.lastName}</p>
                        <p className='text-base text-secondary-green'>{chatUser.additionalInfo.isActive}</p>
                    </div>
                </div>
                <div className='w-fit p-1 text-white hidden sm:block'>
                    <div className='flex gap-6 text-3xl justify-center items-center  duration-75 ease-in cursor-pointer rounded-full'>
                        <FaVideo className='hover:bg-black hover:bg-opacity-20 duration-75 hover:p-2 hover:scale-150 hover:rounded-full'/>
                        <IoMdCall className='hover:bg-black hover:bg-opacity-20 duration-75 hover:p-2 hover:scale-150 hover:rounded-full'/>
                        <FaSearch className='hover:bg-black hover:bg-opacity-20 duration-75 hover:p-2 hover:scale-150 hover:rounded-full' onClick={()=>setViewSearchMessages(true)}/> 
                    </div>
                </div>
                <div className='w-fit text-white text-4xl block sm:hidden'>
                    <div className='flex-col gap-1'>
                        <div className='flex gap-1 items-center cursor-pointer '
                            onClick = {()=>setMenuActive((prev)=>!prev)}
                        >
                            <IoMdMenu />
                            <IoIosArrowDown className={`text-xl duration-[0.35s] ease-[ease] ${menuActive && "rotate-180"}`}/>
                        </div>
                        <div 
                            ref = {menuRef}
                            className={`fixed z-20 space-y-4 h-0 w-16 overflow-hidden bg-white bg-opacity-10 transition-[height] duration-[0.35s] ease-[ease] ${menuActive && "p-2 py-4"}`}
                            style={{height:height}}
                        >
                            <FaVideo className='hover:bg-black hover:bg-opacity-20 duration-75 hover:p-2 mx-auto hover:scale-150 hover:rounded-full'/>
                            <IoMdCall className='hover:bg-black hover:bg-opacity-20 duration-75 hover:p-2 mx-auto hover:scale-150 hover:rounded-full'/>
                            <FaSearch className='hover:bg-black hover:bg-opacity-20 duration-75 hover:p-2 mx-auto hover:scale-150 hover:rounded-full' onClick={()=>setViewSearchMessages(true)}/> 
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[80%] '>
            <img src={ChatBg} className='absolute h-[80%] w-full opacity-10' alt='chat-bg'/>
                <div className={`fixed z-20 ${viewEmoji ? "top-[30%] block w-fit h-full " : "top-[95%]  w-0 h-0 p-10 "} duration-500 ease-in-out bottom-1 `}>
                    <EmojiPicker id="emoji-picker" onEmojiClick={(emoji) => appendEmojiToMesaage(emoji)} />
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
                <div className={`absolute top-[11%] h-[80%] ${viewSearchMessages ? "w-[35%] ": "w-0"} duration-[.5s] ease-out transition-[width] right-0 bg-black bg-opacity-50 z-5`}>
                    {
                        viewSearchMessages && <SearchMessages setViewSearchMessages={setViewSearchMessages} />
                    }
                </div>
            </div>
            {
                !recordAudio && (
                    <div className='w-full flex justify-around items-center gap-2 mt-3'>
                        <div className='w-fit h-full bg-black bg-opacity-15 gap-2 sm:gap-4 flex justify-center items-center'>
                            <button className='w-fit z-40 p-2 bg-transparent hover:bg-white hover:bg-opacity-15 backdrop-blur-sm rounded-full hover:p-3 hover:text-2xl duration-75 ease-in text-white text-3xl'>
                                <GrAttachment onClick={() => docRef.current.click()} />
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
                            className=' w-7/12 sm:w-full h-12 outline-none border-none bg-transparent bg-white bg-opacity-15 px-2 text-sm sm:text-base sm:px-4 md:text-lg lg:text-xl xl:text-2xl rounded-md text-secondary-green placeholder:text-secondary-green '
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