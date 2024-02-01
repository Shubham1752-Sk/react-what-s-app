import React from 'react'
import { useSelector } from 'react-redux'

import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

const Template = ({formType, title}) => {

    const { loading } = useSelector((state)=> state.auth)

    return(
        <div className='login flex items-center justify-center min-h-screen text-puregray-25 text-pure-greys-50 bg-gradient-to-r from-teal-200 to-lime-200 '>
        {/* <img src="https://imgs.search.brave.com/dZbVyqKypsYHgVCO-F37QJWB7zwIqDgEXn4YKEGopaw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci84MTgv/MTQ4L0hELXdhbGxw/YXBlci13aGF0c2Fw/cC1iYWNrZ3JvdW5k/LWNvb2wtZGFyay1n/cmVlbi1uZXctdGhl/bWUtd2hhdHNhcHAu/anBn" className=" w-[400px] h-full hidden rounded-r-2xl md:block object-cover relative"/> */}
        <div className='relative z-10 flex flex-col m-6 space-y-8  bg-black bg-opacity-10 backdrop-blur-sm shadow-2xl rounded-2xl md:flex-row md:space-y-0 '>
            {
                formType === 'signup' ? <SignupForm/> : <LoginForm/>
            }
            <div className='relative z-10'>
                <img alt='bg-img' src="https://imgs.search.brave.com/dZbVyqKypsYHgVCO-F37QJWB7zwIqDgEXn4YKEGopaw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci84MTgv/MTQ4L0hELXdhbGxw/YXBlci13aGF0c2Fw/cC1iYWNrZ3JvdW5k/LWNvb2wtZGFyay1n/cmVlbi1uZXctdGhl/bWUtd2hhdHNhcHAu/anBn" className=" w-[400px] h-full hidden rounded-r-2xl md:block object-cover " />
                <div className=' absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block '>
                    <span className='text-white text-xl'> We've been using untitle to kick <br /> start every new project and cant<br /> imagne working without it</span>
                </div>
            </div>
        </div>
    </div>
    )

}

export default Template