import React, { useState } from 'react'
import Contactcard from './Contactcard'


const ContactList = () => {

  const [contacts, setContatcts ] = useState()

  return (
    <div className='w-full h-full rounded-tr-xl rounded-br-xl flex flex-xol bg-transparent gap-2' >
      {
        contacts ? ( <Contactcard
          
        /> ) : ("No contacts !!")
      }
    </div>
  )
}

export default ContactList