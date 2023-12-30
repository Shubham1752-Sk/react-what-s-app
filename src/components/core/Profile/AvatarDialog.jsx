import React from 'react'
import { AvatarOptions } from '../../../utils/constants'

const AvatarDialog = ({setDefaultAvatar}) => {
    
    const setAvatarImage = (key) =>{
        console.log(key)
        // console.log(AvatarOptions.filter((avatar)=> avatar.key===key)[0].img)
        const img = AvatarOptions.filter((avatar)=> avatar.key===key)[0].img;
        console.log(img)
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload=()=>{
        console.log(reader);
        setDefaultAvatar(reader.result);
        }
    }
  return (
    <div className='w-full h-[90%] py-4 flex gap-4 flex-wrap justify-center items-center'>
        {
            AvatarOptions.map((avatar)=>{
                return (
                    <img 
                    key={avatar.key} 
                    src={avatar.img}
                    alt='avatar'
                    className='w-[40px] sm:w-[45px] md:w-[65px] lg:w-[85px] rounded-full ease-in duration-75 hover:border-4 border-black hover:px-1 hover:py-1 hover:shadow-sm shadow-black'
                    onClick={()=>setAvatarImage(avatar.key)}
                    />
                )
            })
        }
    </div>
  )
}

export default AvatarDialog