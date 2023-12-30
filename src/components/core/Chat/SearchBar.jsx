import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa"
import { useSelector } from 'react-redux'

const SearchBar = () => {

  const [suggestions, setSuggestions] = useState(null)
  const [number, setNumber] = useState("")

  const { users } = useSelector((state) => state.chat)

  console.log("suggestions :",suggestions)

  const handleChange = (e) => {
    setNumber(
      e.target.value
    )
    console.log(number)

    let filteredUsers = users.filter((user) => user.mobileNumber.includes(number))
    // console.log(filteredUsers)
    setSuggestions(filteredUsers)
  }

  return (
    <div className='h-[7%] w-full flex justify-around gap-2 flex-wrap items-center mt-4 px-4 py-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm shadow-sm shadow-black'>
      <div className='w-full h-full flex justify-center items-center gap-2'>
        <div className=' w-8/12 lg:w-10/12 '>
          <input
            type="text"
            name='number'
            value={number}
            onChange={handleChange}
            placeholder='Enter Friend Number...'
            className=' outline-none border-none bg-transparent px-2 border-b border-border-green text-lg rounded-md text-secondary-green placeholder:text-secondary-green '
          />
        </div>
        <div className='w-[2px] bg-border-green h-full '></div>
        <div className='w-1/12  h-full text-secondary-green flex justify-center items-center'>
          <FaSearch className='font-bold text-base md:text-sm lg:text-xl scale-150 ' />
        </div>
      </div>
      {
        suggestions && (
          <div className='w-full h-fit bg-black bg-opacity-50 rounded-2xl mt-2'>
            <div className='fixed w-7 h-5 bg-black bg-opacity-30 ml-4 rotate-45 '></div>
            {
              suggestions.map((suggestion)=>(
            <div key={suggestion.index} className='w-full h-14 flex justify-around items-center z-10 '>
              {/* <p>{`${suggestion.firstName} ${suggestion.lastName}`}</p> */}
              <div className='w-12 h-12 border rounded-full'>
                <img src={suggestion.additionalInfo.profilePhotot} />
              </div>
            </div>
          ))
            }
          </div>
        )
      }
    </div>
  )
}

export default SearchBar