import React from 'react'
import { useNavigate } from 'react-router-dom'

const Contactcard = ({ user, isContact, isSuggestion, manageChat, addToContacts }) => {
  const navigate = useNavigate()
  return (
    <div className={` h-20  rounded-xl gap-4 flex justify-start items-center ${isContact ? "bg-white bg-opacity-10 border-b-[3px] " : isSuggestion ? "bg-black bg-opacity-50" : "bg-white bg-opacity-70 rounded-none p-1 w-full"} ${isContact && "hover:border-l-4 hover:border-b-8 duration-100 ease-in"}  border-[#444f4b] hover:cursor-pointer`}
      onClick={() =>{
        if(isSuggestion) {addToContacts(user.id)}
        if(isContact){manageChat(user)}
        else navigate(`/create-profile/${user._id}`)
      }}
    >
      <div className={`w-16 h-16 max-w-[65px] max-h-[65px] flex justify-center items-center border-2 p-0.5 ${ !isContact && !isSuggestion && "border-black hover:p-1 duration-75 hover:border-4" }  rounded-full `}>
        <img
          src={user.profilePhoto}
          alt="avatar"
          className='rounded-full w-full h-full'
        />
      </div>
      <div className='flex-col '>
        <p className={`text-xl ${ !isContact && !isSuggestion ? "text-black" : "text-secondary-green"} `} >{`${user.firstName} ${user.lastName}`}</p>
        {/* <p className='text-sm text-secondary-green'>last message</p> */}
      </div>
    </div>
  )
}

export default Contactcard