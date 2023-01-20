import React from 'react'
import { RiArrowLeftSLine } from 'react-icons/ri'

const Goback = () => {

    function backButton() {
     
        window.history.back();
        window.scrollTo(0, 0);
        
        }

  return (
    <div>
    <button>
        <RiArrowLeftSLine
         onClick={backButton}
         className='bg-[var(--app-second-col)] text-white h-12 w-12  p-2 border-2 border-white rounded-full absolute top-20 left-4 hover:scale-110 duration-100 cursor-pointer' />
    </button>
    </div>
  )
}

export default Goback