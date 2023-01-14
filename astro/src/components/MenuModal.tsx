import React from 'react'
import {RiHome5Line, RiFileList2Line, RiMapPinLine, RiAccountPinBoxLine, RiArrowRightSLine, RiEarthLine} from 'react-icons/ri'

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
    <div className='fixed w-full bg-[var(--bg-wrapper)] z-[20] top-0 left-0 h-screen ' onClick={()=> setOpenMenu(false)}/> 
     

    
    
        <motion.div 
        variants={sectionVariant}
       initial="hidden"
       animate='show'
        className=' bg-[var(--app-col)] scrollLock right-0 z-50 h-[100vh] top-0 w-60 fixed'>
        
          <div className='p-3 bg-[var(--app-second-col)] h-24'>
              
           <div onClick={() => setOpenMenu(false)}>
          <RiArrowRightSLine className='bg-[var(--app-second-col)] text-white h-14 w-14 rounded-full absolute ml-[-14%]' />
           </div>
          </div>

         
            {/**menu  */}
       <div className='flex flex-col ml-16 gap-5 mt-28'>
       <a href={`/`} onClick={() => setOpenMenu(false)}>
         <div className='flex items-center space-x-2'>
          <RiHome5Line className='text-xl text-[var(--app-second-col)]'/>
         <button className='text-xl  font-semibold text-[var(--app-second-col)]'>Home</button>
         </div>
       </a>

       <a href={'#about'} onClick={() => setOpenMenu(false)} className='flex  items-center space-x-2'> 
         <RiMapPinLine className='text-xl text-[var(--app-second-col)]' />
         <button className='text-xl  font-semibold text-[var(--app-second-col)]'> About us</button>
       </a>
      


       <a href={'/#explore'} onClick={() => setOpenMenu(false)}>
         <div className='flex items-center space-x-2'>
           <RiEarthLine className='text-xl text-[var(--app-second-col)]'/>
           <button className='text-xl   font-semibold text-[var(--app-second-col)]'>Explore</button>
         </div>
       </a>

       {/**contact us */}
       <a href={'/contact'} onClick={() => setOpenMenu(false)} className='flex  items-center space-x-2'> 
        <RiAccountPinBoxLine className='text-xl text-[var(--app-second-col)]'/>
        <button className='text-xl font-semibold text-[var(--app-second-col)]'>Contact us</button>
       </a>



       <a href={'/blog/posts'} onClick={() => setOpenMenu(false)}>
         <div className='flex  items-center space-x-2'>
           <RiFileList2Line className='text-xl text-[var(--app-second-col)]'/>
           <button className='text-xl  font-semibold text-[var(--app-second-col)]'>Blog</button>
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