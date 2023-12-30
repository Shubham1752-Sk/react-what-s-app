import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdOutlineClose } from "react-icons/md";
import { getProfileDetails } from '../../../services/operations/profileAPI'

import logo from "../../../assets/whatsapp.gif"
import defaultImg from "../../../assets/default_avatar.png"
import InputFeild from './InputFeild'
import ProfileSelector from './ProfileSelector'
import AvatarDialog from './AvatarDialog'
import Webcam from 'react-webcam';
import { FaCircle } from 'react-icons/fa';
import Spinner from '../../common/Spinner';
import { updateProfile } from '../../../services/operations/profileAPI';

const CreateProfile = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.profile)
    // console.log(location);
    const id = location.pathname.split("/").at(-1);
    // console.log(id)
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
    })
    const [viewChooseProfileMenu, setViewChooseProfileMenu] = useState(false)
    const [viewDialog, setViewDialog] = useState(false)
    const [viewAvatarDialog, setViewAvatarDialog] = useState(false)
    const [viewCameraDialog, setViewCameraDialog] = useState(false)
    const [defaultAvatar, setDefaultAvatar] = useState(defaultImg)
    const [formData, setFormData] = useState({
        gender: "",
        dateOfBirth: "",
        about:"",
        profilePhoto: defaultAvatar
    })


    const webcamref = useRef(null)

    const options = {
        setViewAvatarDialog,
        setViewCameraDialog,
        viewChooseProfileMenu,
        setViewChooseProfileMenu,
        setViewDialog,

        // image coponents
        defaultAvatar,
        setDefaultAvatar
    }

    useEffect(() => {
        dispatch(getProfileDetails(id, setUser));

        if(!user){
            navigate('/signup')
        }

    }, [])

    useEffect(()=>{
        setFormData({
            ...formData,
            [formData.profilePhoto]: defaultAvatar
        })
    },[defaultAvatar])

    
    const capture = () => {
        const image = webcamref.current.getScreenshot();
        setDefaultAvatar(image)
    }

    const handleFormChannge = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        console.log(formData)
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(formData)

        if( !formData.dateOfBirth || !formData.gender ){
            alert('Dob and Gender are Compulsory Fields!!');
        }
        
        dispatch(updateProfile(id, formData.about, formData.gender, formData.dateOfBirth, formData.profilePhoto, dispatch, navigate))

        setFormData({
            gender: "",
            dateOfBirth: "",
            about:"",
            profilePhoto: defaultAvatar
        })
    }

    return (
        <div>
            {
                loading ? (
                    <Spinner text={"Please wait loading Your Profile.."}/>
                ) : (
                    <div className='relative h-screen w-screen bg-panel-bg flex flex-col gap-6 justify-start  sm:justify-center items-center mx-auto'
                    // onMouseUp={()=>{
                    //     closeModals()
                    // }}
                    >
                        <div className='relative flex w-full items-center gap-4 mx-auto justify-center mt-10 sm:mt-0 '>
                            <div className=' w-2/12 md:w-2/12 lg:w-2/12'>
                                <img src={logo} alt='gif' />
                            </div>
                            <div className='text-3xl font-bold text-white sm:text-3xl md:text-5xl lg:text-7xl'>
                                Welcome to Gup-Shup<br />
                                <span className='text-sm sm:text-lg lg:text-2xl font-thin'>Complete Your Profile to Continue!!</span>
                            </div>
                        </div>
                        <div className=' relative w-10/12 h-1/3 gap-5 mx-auto justify-center items-center sm:flex sm:h-1/2  '>
                            <div className='mx-auto gap-4 h-1/2 flex justify-center items-baseline sm:w-5/12 bg-black bg-opacity-10 sm:h-full sm:flex-col sm:justify-around sm:items-center py-4 '>
                                <InputFeild user={user} title={"Display name"} />
                                <InputFeild user={user} title={"About"} />
                                <button 
                                    className=" relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" 
                                    onClick={handleSubmit}
                                >
                                    Continue to chat...
                                </button>
                            </div>
                            <div className='mx-auto  sm:w-5/12 h-fit sm:h-full  mt-8 sm:mt-0 flex sm:flex-col justify-start sm:gap-8 items-center sm:py-4 '>
                                <ProfileSelector options={options} />
                                <div className='bg-black bg-opacity-10 h-full w-full flex flex-col  text-secondary-green justify-center items-center   md:-mt-6 lg:mt-0'>
                                    <div className='w-11/12  flex justify-around py-2 gap-2 '>
                                        <label className='text-primary-green font-bold text-xl '>Gender</label>
                                        <div className=' w-1/2 sm:w-auto text-lg sm:text-xl flex flex-wrap gap-x-4 md:text-lg'>
                                            <div className='flex gap-4 sm:gap-2  justify-center group-hover:animate-bounce  lg:text-xl'>
                                                <input type='radio' id="male" name='gender' value='MALE' onChange={handleFormChannge} checked={formData.gender === 'MALE'} />
                                                <label htmlFor='male'>Male</label>

                                            </div>
                                            <div className='flex gap-4 sm:gap-2 justify-center'>
                                                <input type='radio' id="female" name='gender' value='FEMALE' onChange={handleFormChannge} checked={formData.gender === 'FEMALE'} />
                                                <label htmlFor='female'>Female</label>
                                            </div>
                                            <div className='flex gap-4 sm:gap-2 justify-center'>
                                                <input type='radio' id="others" name='gender' value='OTHERS' onChange={handleFormChannge} checked={formData.gender === 'OTHERS'} />
                                                <label htmlFor='others'>Others</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=' w-full sm:flex justify-around items-center px-2 py-2 gap-2 ' >
                                        <label htmlFor='dateOfBirth' className=' px-2 sm:px-0 text-primary-green font-bold text-center text-xl '>Date Of Birth</label>
                                        <input type="date" name="dateOfBirth" id="dateOfBirth" onChange={handleFormChannge} className=' w-10/12 sm:w-1/2 text-center text-base md:text-xl h-8 rounded-lg bg-none bg-transparent border-b border-border-green ' />
                                    </div>
                                </div>
                            </div>
                            <div className='block sm:hidden w-8/12 h-12 mt-6 mx-auto justify-center '>
                                <button 
                                    className=" relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" 
                                    onClick={handleSubmit}
                                >
                                    Continue to Gup-Shup 😉
                                </button>
                            </div>
                        </div>
                        {/* Dialog Container */}
                        {
                            viewDialog && (
                                <div className='fixed w-screen h-screen bg-black bg-opacity-20 backdrop-blur-sm text-2xl flex justify-center items-center z-50 ' onClick={() => setViewDialog(false)}>
                                    <div className='w-1/2 h-1/2 flex flex-col gap-2 justify-start items-center bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700 '>
                                        <div className='w-full flex justify-end items-center'>
                                            <div className='w-full  px-4'>
                                                <h1 className='font-bold text-3xl text-white'>
                                                    {
                                                        viewAvatarDialog ? "Choose Your Avatar" : "Say CHEESE 😁"
                                                    }
                                                </h1>
                                            </div>
                                            <button className='w-1/6 px-2 py-2 flex justify-center items-center text-2xl '>
                                                <MdOutlineClose className='text-white text-4xl font-bold' />
                                            </button>
                                        </div>
                                        {/* <div className='w-full mx-auto flex-col justify-center items-center'>
                                <div className={` w-10/12 flex ${viewCameraDialog && 'flex-col'} items-center `}>
                                    {
                                        viewAvatarDialog && <AvatarDialog setDefaultAvatar={setDefaultAvatar}/> || viewCameraDialog && <CameraDialog />
                                    }
                                </div>
                                <div className='w-full flex justify-center'>
                                    <button 
                                    className=' w-2/6 px-2 py-2 bg-[#62e38b] text-white font-bold rounded-xl mt-4'
                                    onClick={()=>setViewDialog(false)}>
                                        Continue...
                                    </button>
                                </div>
                            </div> */}
                                        <div className={`w-11/12 h-[80%] ${viewCameraDialog ? 'flex' : 'flex-col justify-center items-center'} gap-2 px-2 text-white`}>
                                            <div>
                                                {
                                                    viewAvatarDialog && <AvatarDialog setDefaultAvatar={setDefaultAvatar} /> || viewCameraDialog && (

                                                        <div className='w-[80%] mr-10 h-full'>
                                                            <Webcam className='w-full' ref={webcamref} />
                                                            {/* <Camera onTakePhoto = { (dataUri) => { setscreenShot(dataUri); }}/> */}
                                                            {/* <p>Camera</p> */}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={` ${viewCameraDialog ? "w-4/12" : "w-full"} flex justify-center items-center`}>
                                                {
                                                    viewCameraDialog ? (
                                                        <div className=' rounded-full p-1 hover:p-1.5 ease-in duration-75 hover:border-6 hover:border-black 1 border-4 border-white flex justify-center items-center'>
                                                            <button className='text-7xl rounded-full mx-auto bg-white active:bg-black'
                                                                onClick={capture}>
                                                                <FaCircle />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className='w-4/12 flex justify-center'>
                                                            <button
                                                                className=' w-5/6 px-2 py-2 bg-[#62e38b] text-white font-bold rounded-xl -mt-1 '
                                                                onClick={() => setViewDialog(false)}>
                                                                Skip ...😕
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default CreateProfile