import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from "react-hot-toast";
import { sendotp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"

const SignupForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber:"",
    confirmPassword: "",
  })

  const handleFormData=(e)=>{
    setFormData((prev)=>({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // console.log(formData)
  }

  const SignupHandler = (e) =>{
    
    e.preventDefault();

    if( formData.password !== formData.confirmPassword ){
      toast.error("Passwords do not Match")
      alert("Passwords do not match")
      return
    }

    const signupData = { ...formData };

    // console.log(`Signnup data is: ${JSON.stringify(signupData)}`,)
    // console.log(`formdata is: ${JSON.stringify(formData) }`,formData)

    dispatch(setSignupData(signupData));
    const email = formData.email;

    const sendotpPayload = {
      email,
      navigate
    }
    dispatch(sendotp(sendotpPayload))

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber:"",
      password: "",
      confirmPassword: "",
    })

  }

  return (
    <form onSubmit={SignupHandler}>
      <div className='flex flex-col justify-center p-8 md:p-14 outline-1 outline-white outline-double rounded-tl-lg rounded-bl-lg'>
      <span className='mt-2 text-4xl font-bold'>Welcome</span>
      <span className='font-light text-gray-400 mb-8'>Please Enter Your details</span>
      <div className='flex w-full space-x-4'>
        <div className='py-2 w-1/2'>
          <span className='mb-2 text-md'>First Name <span className=' text-orange-2'>*</span></span>
          <input required type='text' onChange={handleFormData} className=' w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500' name='firstName' id="fname" value={formData.firstName} />
        </div>
        <div className='py-2 w-1/2'>
          <span className='mb-2 text-md'>Last Name</span>
          <input type='text' onChange={handleFormData} className=' w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500' name='lastName' id="lastName" value={formData.lastName} />
        </div>
      </div>
      <div className='flex w-full space-x-4'>
        <div className='py-2 w-1/2'>
          <span className='mb-2 text-md'>E-mail <span className=' text-orange-2'>*</span></span>
          <input required type='text' onChange={handleFormData} className=' w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500' name='email' id="email" value={formData.email} />
        </div>
        <div className='py-2 w-1/2'>
          <span className='mb-2 text-md'>Mobile No.</span>
          <input type='text' onChange={handleFormData} className=' w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500' name='mobileNumber' id="mobileNumber" value={formData.mobileNumber} />
        </div>
      </div>
      <div className=' py-2'>
        <span className='mb-2 text-md'>Password <span className=' text-orange-2'>*</span></span>
        <input required type="password" onChange={handleFormData} name="password" id="pass" value={formData.password} className=' w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500' />
      </div>
      <div className=' py-2'>
        <span className='mb-2 text-md'>Confirm Password <span className=' text-orange-2'>*</span></span>
        <input required type="password" onChange={handleFormData} name="confirmPassword" id="cpass" value={formData.confirmPassword} className=' w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500' />
      </div>
      {/* <div className='flex justify-between w-full py-4'>
                                        <div className=" mr-24">
                                            <input type="checkbox" name="ch" id="ch" className='mr-2' />
                                            <span className=' text-md'>Remember for 30 days</span>
                                        </div>
                                        <span className=' font-bold text-md'>forgot password</span>
                                    </div> */}
      <button className=' w-full bg-black text-white p-2 rounded-lg mb-6 mt-4 hover:bg-white hover:text-black hover:border hover:border-gray-300' type='submit' >Sign Up</button>
      <button className=' w-full border border-gray-300 text-base p-2 rounded-lg mb-6 hover:bg-black hover:text-white inline' onClick={() => SignupHandler()}> Sign Up with Google</button>
      <div className=' text-center text-pure-greys-400 '>
        Already have an Account
        <span className='font-bold text-white hover:underline hover:cursor-pointer ml-4'>Login to Continue</span>
      </div>
    </div>
    </form>
  )
}

export default SignupForm