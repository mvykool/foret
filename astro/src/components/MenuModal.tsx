import React, { useRef} from 'react'
import { RiCloseFill, RiShoppingBagFill } from 'react-icons/ri'
import {AiFillHome} from 'react-icons/ai'
import { MdCategory, MdArticle, MdContacts, MdSupportAgent, MdLogout } from 'react-icons/md'
import { motion} from 'framer-motion'

/**framer motion variants */
 
const sectionVariant = {
  hidden : { opacity: 0, x: 10},
  show: { opacity: 1, x:0,
  transition: { duration: 0.5, delay: 0.1}
  }
} 


interface Props{
    openMenu: any,
    setOpenMenu: any
}
  

const MenuModal = ({openMenu, setOpenMenu}: Props) => {

  return (
    <>
    <div className='fixed w-full bg-[var(--bg-wrapper)] z-50 top-0 left-0 h-screen ' onClick={()=> setOpenMenu(false)}/> 

    
        <motion.div 
        variants={sectionVariant}
       initial="hidden"
       animate='show'
        className=' bg-[var(--app-col)] scrollLock right-0 z-50 h-[100vh] top-0 w-60 fixed'>
        
          <div className='p-3' onClick={() => setOpenMenu(false)}>
            <RiCloseFill className='text-[var(--app-second-col)] h-7 w-7 absolute right-4' />
          </div>
         
            {/**menu  */}
       <div className='flex flex-col ml-16 gap-5 mt-28'>
       <a href={`/`} onClick={() => setOpenMenu(false)}>
         <div className='flex items-center space-x-2'>
          <AiFillHome className='text-xl text-[#00708C]'/>
         <button className='text-xl  font-semibold text-[#00708C]'>Home</button>
         </div>
       </a>

       <a href={'/support/chat'} onClick={() => setOpenMenu(false)} className='flex  items-center space-x-2'> 
         <MdSupportAgent className='text-xl text-[#00708C]' />
         <button className='text-xl  font-semibold text-[#00708C]'> About us</button>
       </a>
      


       <a href={'/shop'} onClick={() => setOpenMenu(false)}>
         <div className='flex items-center space-x-2'>
           <RiShoppingBagFill className='text-xl text-[#00708C]'/>
           <button className='text-xl   font-semibold text-[#00708C]'>Explore</button>
         </div>
       </a>

       {/**contact us */}
       <a href={'/contact'} onClick={() => setOpenMenu(false)} className='flex  items-center space-x-2'> 
        <MdContacts className='text-xl text-[#00708C]'/>
        <button className='text-xl font-semibold text-[#00708C]'>Contact us</button>
       </a>



       <a href={'/blog/posts'} onClick={() => setOpenMenu(false)}>
         <div className='flex  items-center space-x-2'>
           <MdArticle className='text-xl text-[#00708C]'/>
           <button className='text-xl  font-semibold text-[#00708C]'>Blog</button>
         </div>
       </a>

       </div>

       {/**footer */}

       <div className='absolute bottom-0 w-full border-t-2 border-[var(--app-second-col)] p-5'>
         <h2 className='flex justify-center text-white'>Forêt | v1.0.0</h2>
       </div>
      

        </motion.div>
    
    </>
  )
}

export default MenuModal