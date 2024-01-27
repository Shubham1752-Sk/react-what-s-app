import React, { memo } from 'react'
import { RiCheckDoubleFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import {getTime} from "../../../utils/getTime"
import AudioMessage from './AudioMessage';

const ChatMessage = memo(function({ message, user, isHovered, setHovered }){

    const handleDownload = async (url) => {
        console.log(url)
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a blob URL for the file
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'downloaded-file';

            // Append the link to the document
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error.message);
        }
    }


    return (
        <div className={`relative flex items-center ${message.sentBy === user._id ? "justify-end" : "justify-start"} px-2 py-1 rounded-md m-2 box-border `}>
            <div className={`w-fit h-full ${message.sentBy === user._id ? "bg-[#10361b]" : "bg-[#3e413e]"}  px-2 py-1 flex-col gap-2 text-base hover:cursor-pointer peer-hover:bg-black `}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >

                <div className={` absolute bg-black bg-opacity-50 p-1 duration-100 ease-in-out ${isHovered ? "h-[82%] w-[29%] block" : "hidden"} flex justify-center items-center ${message?.media?.media_type ==="image" || message?.media?.media_type ==="video" ? "block" : "hidden"}`}>
                    <button className={` bg-white rounded-full text-[#4a4a4c] hover:animate-bounce`}
                        onClick={() => {
                            handleDownload(message.media.url)
                        }}
                    >
                        {isHovered && <MdFileDownload className='p-2 text-4xl  hover:block' />}
                    </button>
                </div>
                <div className='text-[#f1f8f2] w-fit max-w-[300px] h-fit max-h-[40%]'>
                    {message.text ? message.text : message.media.media_type === "image" ? <img src={message.media.url} alt="#" className='h-full w-full object-contain' /> : message.media.media_type === "video" ? <video width="750" height="500" controls >
                        <source src={message.media.url} type="video/mp4" />
                    </video> : <AudioMessage message={message} />}
                </div>
                <div className={` ${message.sentBy === user._id ? "w-[4.5rem]" : "w-13"} w-full z-20 flex gap-1 items-end text-end mt-1 justify-end text-xs text-gray-400`}>
                    <p>{getTime(message.createdAt)}</p>
                    {
                        message.status === 'sent' ? (
                            <div className={`${message.sentBy === user._id ? "block" : "hidden"}`}><IoMdCheckmark /></div>
                        ) : (
                            <>
                                {
                                    message?.media?.media_type !== 'audio' && <div className={`${message.status === "read" ? "text-blue-500" : "text-[#4a4a4c]"} ${message.sentBy === user._id ? "block" : "hidden"} `}><RiCheckDoubleFill /></div>
                                }
                            </>
                        )
                    }
                </div>

            </div>

        </div>
    )
})

export default ChatMessage