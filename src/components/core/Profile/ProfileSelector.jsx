import React, { useState, useRef } from 'react'
import { FaCamera } from "react-icons/fa"
// import defaultImg from "../../../assets/default_avatar.png"
import ChooseProfileMenu from './ChooseProfileMenu';
import Webcam from 'react-webcam';
const ProfileSelector = ({options}) => {

  // const [ selectedImage, setSelectedImage ] = useState(defaultImg);
  const [ hover, setHover ] = useState(false);
  // const [ viewChooseProfileMenu, setViewChooseProfileMenu ] = useState(false);
  
  const fileInput = useRef(null);
  // const webCamRef = useRef(null);

  const handleProfileChange = (e) => {
    const {files} = e.target;
    // console.log(files)
    if(!files.length){return;}
    // const filename = files[0].name;
    // var parts = filename.split(".");
    // const fileType = parts[parts.length-1]
    // console.log(fileType)
    // if(fileType !=='jpg' || fileType !=='png'||fileType!=='svg'){
    //   alert("File Type not Supported ....\n Try jpg, png, svg files or choose from our Library")
    //   return;
    // }
    // const imgDetail = e.target.files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(imgDetail);
    // reader.onload=()=>{
    //   console.log(reader);
    //   options.setDefaultAvatar(reader.result);
    // }
    options.setDefaultAvatar(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div className='relative w-full h-[90%] sm:max-h-[60%] bg-panel-bg sm:-mt-4 flex justify-center items-start ' >
      <div className=' relative w-fit sm:w-[200px] flex justify-center items-center border  rounded-full object-contain  hover:cursor-pointer '
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)} 
      onClick={()=>options.setViewChooseProfileMenu((prev)=>!prev)}
      // onMouseDown={()=>options.setViewChooseProfileMenu((prev)=>!prev)}
      > 
        {
          hover && (
            <div className='absolute z-10 text-white w-full h-full rounded-full bg-opacity-15 flex flex-col justify-center items-center gap-2'
            >
              <FaCamera className='text-4xl'/>
              <div className=' text-center text-sm sm:text-lg lg:text-xl'>
                Select your Avatar
              </div>
            </div>
          )
        }
        {
          options.viewChooseProfileMenu && (
            <div className='absolute z-20 w-full '>
              <ChooseProfileMenu 
                fileInput={fileInput} 
                // webCamRef={webCamRef} 
                // setViewCamera={setViewCamera} 
                // setDefaultAvatar={options.setDefaultAvatar} 
                // defaultImg={options.DefaultAvatar} 
                options={options}
              />
            </div>
          )
        } 
       
          <div className='max-w-[200px] '>
            <img
              src={options.defaultAvatar}
              alt="default_avatar"
              fill
              className='w-[200px] h-[200px] border object-cover rounded-full'

            />
          </div>
        
        <input 
          className='hidden'
          type="file"   
          ref={fileInput} 
          onChange={handleProfileChange} 
          accept="image/png, image/gif, image/jpeg, image/jpg"   
        />
        
      </div>
      {/* {
        viewCamera && (
          <div className='w-full'>
            <div>
            <Webcam height={600} width={600} ref={webCamRef} className='absolute mr-[100%] mb-[-200%]' />
            </div>
            <div>
              <button></button>
            </div>
          </div>
        )
      } */}
    </div>
  )
}

export default ProfileSelector