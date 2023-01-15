import React from 'react'
import {  RiSearch2Line} from 'react-icons/ri'
import { FaFacebookSquare, FaTwitter, FaYoutube, FaInstagramSquare} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-black overflow-x-hidden w-screen border-t-2 border-[var(--app-second-col)]'>
      <div className='flex justify-around pb-4'>
        
        {/**logo with text */}

        <div className='  mt-5'>
           <div className='w-20'>
           <h1 className='text-[var(--app-second-col)] text-lg p-1 flex justify-center rounded-md md:text-2xl'>Forêt
           </h1>
           </div>
          
          <p className='text-white text-xs my-3 w-40 md:w-64 md:text-lg'>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
           
            {/**social media */}

          <div className='flex items-center space-x-2'>
             <FaFacebookSquare className='text-gray-400 md:h-8 md:w-8'/>
             <FaTwitter className='text-gray-400 md:h-8 md:w-8'/>
             <FaInstagramSquare className='text-gray-400 md:h-8 md:w-8'/>
             <FaYoutube className='text-gray-400 md:h-8 md:w-8'/>
          </div>

         </div>
      

      

        {/**newsletter */}

        <div>
          <p className='text-white text-sm mt-10'>Subscribe to newsletter!</p>

          <form className='flex justify-center items-center py-1 mt-2'>
         <input type="text" placeholder='Email..' className=' border-2 border-[var(--app-second-col)] bg-gray-100 py-1 px-2 w-[20vw] rounded-l-md' />
         <button className='bg-[var(--app-second-col)] py-2 px-3 rounded-r-md border-2 border-[var(--app-second-col)]' type='button'><RiSearch2Line className='text-white text-base '/></button>
       </form>
        </div>

      </div>

      {/**links and stuff */}

      <hr  />

      <div className='flex justify-around py-5 '>
          <ul className='flex space-x-4 px-4'>
            <li className='text-gray-400 text-xs md:text-sm'>Q/A</li>
            <li className='text-gray-400 text-xs md:text-sm'>Terms & conditions</li>
            <li className='text-gray-400 text-xs md:text-sm'>Privacy</li>
            <li className='text-gray-400 text-xs md:text-sm'>Contact</li>
          </ul>

      <div className='py-1 flex justify-center'>
           <p className='text-gray-300 text-xs md:text-sm'>&copy;Forêt | 2023</p>
      </div> 
      </div>
        
    

    </footer>
  )
}

export default Footer