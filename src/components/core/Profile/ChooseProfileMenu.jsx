import React, { useRef, useState } from 'react'
import { ProfileOptions, AvatarOptions } from "../../../utils/constants"
import defaultImg from "../../../assets/default_avatar.png"

const ChooseProfileMenu = ({fileInput, webCamRef, options}) => {

    // console.log(options)

    const handleClick = (key) =>{
        // console.log(key)
        // to view the avatar dialog 
        if(key==='1'){
            // console.log("Option 1 pressed!!")
            options.setViewDialog(true)
            options.setViewCameraDialog(false);
            options.setViewAvatarDialog(true)
            // setViewAvatarDialog((prev)=>!prev)
            // console.log('option 1 pressed ',options.viewAvatarDialog)
            
        }
        // to open system files
        if(key==='2'){
            fileInput.current.click();
        }
        
        // to open camera
        if(key==='3'){
            // console.log("Option 3 pressed!!")
            options.setViewDialog(true)
            options.setViewAvatarDialog(false)
            options.setViewCameraDialog(true)
            // setViewCamera((prev)=>!prev)
        }

        // remove image
        if(key==='4'){
            // console.log("Option 4 pressed!!")
            options.setDefaultAvatar(defaultImg)
        }
    }
    // console.log(ProfileOptions)
  return (
    <div className=' ml-32 mt-20 text-md text-white bg-gray-700 w-[12rem] ease-in hover:cursor-pointer rounded-md'>
        {
            ProfileOptions.map((option)=>{
                return( 
                    <div key={option.key} className='w-full px-1 py-2 hover:bg-[#4a4a4c]' onClick={()=>handleClick(option.key)}>
                        {option.title}
                    </div>
                )
            })
        }
    </div>
  )
}

export default ChooseProfileMenu