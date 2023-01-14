import React from 'react'
import { RiArrowRightSLine } from 'react-icons/ri'

const Goback = () => {

    function backButton() {

        window.history.back();
        
        }

  return (
    <div>
    <button>
        <RiArrowRightSLine
         onClick={backButton}
         className='bg-[var(--app-second-col)] text-white h-12 w-12 border-2 border-white rounded-full -ml-10' />
    </button>
    </div>
  )
}

export default Goback