import React, {useState} from 'react'
import {RiMenu5Fill} from 'react-icons/ri'
import MenuModal from './MenuModal'

const MenuMobile = () => {


  const [openMenu, setOpenMenu] = useState(false)

  //lock scrolling when modals are opened 


if (typeof window !== "undefined") {
  let body = window.document.body;

 if(openMenu === true){
  body.style.position = 'fixed'
  body.style.overflow = 'hidden'
}else {
  body.style.position = 'relative'
  body.style.overflow = 'auto'
}
}


  return (
    <div>
        <RiMenu5Fill 
        onClick={() => setOpenMenu(true)}
        className='text-white border-2 border-[var(--app-second-col)]  text-xl w-10 h-10  p-1 rounded-lg'/>

        {openMenu && <MenuModal openMenu={openMenu} setOpenMenu={setOpenMenu} />}  
    </div>
  )
}

export default MenuMobile