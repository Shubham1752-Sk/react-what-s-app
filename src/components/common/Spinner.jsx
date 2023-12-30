import React from 'react'
import logo from "../../assets/whatsapp.gif"

const Spinner = ({text}) => {
  return (
    <div className='w-scren h-screen flex-col justify-center items-center text-white text-2xl bg-panel-bg'>
        <div className='w-full flex justify-center items-center '>
            <img src={logo} alt="logo"/>
        </div>
        <div className='w-full flex justify-center mt-8'>
            <p>{text}</p>
        </div>
    </div>
  )
}

export default Spinner