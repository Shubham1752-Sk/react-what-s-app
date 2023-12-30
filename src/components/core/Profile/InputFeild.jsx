import React from 'react'

const InputFeild = ({user, title}) => {

  const name = user.firstName+" "+user.lastName

  return (
    <div className=" w-8/12 h-1/5 bg-transparent ">
      <h3 className=' tex-md  md:text-2xl text-primary-green font-bold'>{title}</h3>
      <div className=' relative flex flex-col '>
        <input type='text'  
        disabled = { title === 'About' ? false : true}
        placeholder= { title === 'About' ? "Tell about yourself ..." : name } 
        className='text-black bg-transparent text-sm sm:text-base  md:text-xl w-full px-2 py-2 outline-none border-none placeholder:text-secondary-green'/>
        <div className='w-full h-0.5 bg-border-green mt-[-6px]'></div>
      </div>
    </div>
  )
}

export default InputFeild