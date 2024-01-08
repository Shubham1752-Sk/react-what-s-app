import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { IoMdPersonAdd } from "react-icons/io";
import { addToContacts, getUserInfo } from '../../../services/operations/UserAPI';
import { getAllUsers } from '../../../services/operations/ChatAPI';

const SearchBar = ({ user, allUsers }) => {

  const dispatch = useDispatch()

  const [suggestions, setSuggestions] = useState(null)
  const [users, setUsers] = useState()
  const [number, setNumber] = useState("")
  const [hover, setHover] = useState(false)
  const [viewtext, setViewText] = useState(false)


  const { loading } = useSelector((state) => state.chat)
  // const [user, setUser] = useState()

  // const { users } = useSelector((state) => state.chat)
  // const { token } = useSelector((state)=>state.auth)
  // const { user } = dispatch(getUserInfo(token))
  // const {user} = useSelector((state) => state.profile)
  // console.log(user)

  const handleChange = (e) => {
    setNumber(
      e.target.value
    )

    if (e.target.value.length <= 0) {
      setSuggestions(null)
      return
    }

    let filteredUsers = users.filter((user) => user.mobileNumber.includes(number))
    setSuggestions(filteredUsers)
  }

  useEffect(() => {
    dispatch(getAllUsers(setUsers))
  }, [user])
  // console.log(users)

  const addUser = (contactId) => {
    // console.log(`user id is : ${user._id}, contact id is : ${contactId}`)
    dispatch(addToContacts(user._id, contactId))
  }

  // console.log(users)

  return (
        <div className='h-[7%] w-full flex justify-around gap-2 flex-wrap items-center mt-4 px-4 py-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm shadow-sm shadow-black'>
          <div className='w-full h-full flex justify-center items-center gap-2'>
            <div className=' w-11/12 '>
              <input
                type="text"
                name='number'
                value={number}
                onChange={handleChange}
                autoComplete="off"
                placeholder='Enter Friend Number...'
                className=' w-full outline-none border-none bg-transparent px-2 border-b border-border-green text-sm sm:text-base sm:px-0 md:text-lg rounded-md text-secondary-green placeholder:text-secondary-green '
              />
            </div>
            <div className='w-[2px] bg-border-green h-full '></div>
            <div className='w-2/12  h-full text-secondary-green flex justify-center items-center'>
              <FaSearch className='font-bold text-base md:text-sm lg:text-xl scale-150 ' />
            </div>
          </div>
          {
            suggestions && (
              <div className='w-full h-fit bg-black bg-opacity-50 rounded-2xl mt-2 flex-col '>
                <div className='fixed w-7 h-5 bg-black bg-opacity-30 ml-4 rotate-45 hover:cursor-pointer '></div>
                {
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.mobileNumber}
                      className='w-11/12 h-14 flex justify-start items-center  z-10 mx-auto px-4 gap-4 '
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      <div className='w-12 h-12 border rounded-full'>
                        <img
                          src={suggestion.additionalInfo.profilePhoto}
                          alt="avatar"
                        />
                      </div>
                      <div className='flex-col '>
                        <p className='text-lg text-secondary-green'>{`${suggestion.firstName} ${suggestion.lastName}`}</p>
                        <p className='text-sm text-secondary-green'>last message</p>
                      </div>
                      {
                        hover && (
                          <div
                            className='w-12 h-12 z-20 left-[85%] flex rounded-lg  justify-end items-center origin-left absolute duration-100 ease-in text-white hover:text-black hover:-ml-[81%] hover:w-[92%] hover:h-full hover:bg-white hover:bg-opacity-50 backdrop-blur-lg hover:justify-center '
                            onMouseEnter={() => setViewText(true)}
                            onMouseLeave={() => setViewText(false)}
                            onClick={() => addUser(suggestion._id)}
                          >
                            <IoMdPersonAdd className='w-12 h-12 p-1 rounded-full  hover:border-none text-2xl' />
                            {
                              viewtext && (
                                <p className='text-xl items-center '>Add To Contacts</p>
                              )
                            }
                          </div>
                        )
                      }
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