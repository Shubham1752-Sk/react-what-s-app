import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'

const CameraDialog = ({webCamRef}) => {

  // const camRef = useRef(null);
  const [image, setImage] = useState()

  return (
    <div className='w-full h-full py-4 flex gap-4 flex-wrap justify-center items-center'>
        <Webcam className='h-full px-8' ref={webCamRef}  />
    </div>
  )
}

export default CameraDialog