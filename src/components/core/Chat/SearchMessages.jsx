import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";

const SearchMessages = memo(function({setViewSearchMessages}){

    const {chatMessages} = useSelector((state)=>state.chat)

    const [filteredMessages, setFilteredMessages] = useState(null)

    useEffect(()=>{
        if(chatMessages){
            console.log("Chat Messages Present")
        }
    },[])

    const handleChange = (event) => {
        console.log(event.target.value)
        if(event.target.value.length === 0){
            setFilteredMessages(null)
            return
        }
        // setSearchedMessage(event.target.value)
        setFilteredMessages(
            chatMessages.filter((message)=> message?.text.includes(event.target.value))
        )
        console.log(filteredMessages)
    }

  return (
    <>
        <div className=' w-full h-full p-2 gap-4 flex-col'>
            <div className='flex justify-around text-white '>
                <p>Search Chat Messages</p>
                <IoClose className='text-2xl cursor-pointer z-10' onClick={()=>setViewSearchMessages(false)}/>
            </div>
            <div className='mt-2'>
                <input 
                type="text"
                name = "searchedMessge" 
                // value={searchedMessge}
                placeholder="Search messages..." 
                className='w-full rounded-lg p-2 text-base sm:text-xl font-semibold bg-white bg-opacity-10 outline-none focus' 
                onChange={(e)=>{handleChange(e)}}
                />
            </div>
            <div className='w-full h-[80%] '>
            
                {
                    filteredMessages ? (
                        <div className='mt-2 w-full h-full flex-col space-y-4 p-1 overflow-scroll'>
                        <p className='text-white'>{filteredMessages?.length} messages found</p>
                            {
                                filteredMessages.map((message)=>{
                                    return(
                                        <div key={message._id} className='w-full bg-white rounded-full p-1 px-2'>
                                            <p>{message.text}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (<div className='mt-2 text-lg text-white'>
                        No Messages Found !!
                    </div>)
                }
            </div>
        </div>
    </>
  )
})

export default SearchMessages