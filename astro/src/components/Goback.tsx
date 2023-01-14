import React from 'react'
import { RiArrowLeftSLine } from 'react-icons/ri'

const Goback = () => {

    function backButton() {

        window.history.back();
     
        
        }

  return (
    <div>
    <button>
        <RiArrowLeftSLine
         onClick={backButton}
         className='bg-[var(--app-second-col)] text-white h-12 w-12  p-2 border-2 border-white rounded-full -ml-10' />
    </button>
    </div>
  )
}

export default Goback