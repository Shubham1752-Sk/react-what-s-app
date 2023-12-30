import React, { useEffect } from 'react'
import ContactList from '../components/core/Chat/ContactList'
import SearchBar from '../components/core/Chat/SearchBar'
import { getAllUsers } from '../services/operations/ChatAPI'
import { useDispatch, useSelector } from 'react-redux'

import Spinner from "../components/common/Spinner"

const Chat = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  },[])

  const { loading } = useSelector((state) => state.chat)

  return (
    <div>
      {
        loading ? (
          <Spinner />
        ) : (
          <div className=' w-[100vw] h-[100vh] relative flex justify-start items-center mx-auto gap-4 bg-panel-bg'>
            <div className='flex flex-col relative gap-4 w-5/12 px-2 py-1 items-start h-full '>
              <SearchBar />
              <ContactList />
            </div>
            <div className='w-full h-full relative'>Left side</div>
          </div>
        )
      }
    </div>
  )
}

export default Chat