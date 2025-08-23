import React, {useRef, useState} from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import UpcomingRidePopup from '../components/UpcomingRidePopup'
import { useGSAP } from '@gsap/react/dist'
import { gsap } from 'gsap/dist/gsap'
import CofirmUpcomingRidePopup from '../components/CofirmUpcomingRidePopup'

const CaptainHome = () => {
  const [UpcomingRidePanel, setUpcomingRidePanel] = useState(false);
  const [CofirmUpcomingRidePanel, setCofirmUpcomingRidePanel] = useState(false);
  const UpcomingRidePanelRef = useRef(null)
  const CofirmUpcomingRidePanelRef = useRef(null)

  // Animation for UpcomingRidePanel
  useGSAP(() => {
    // ensure the DOM node exists before animating (prevents GSAP "target null not found")
    if (!UpcomingRidePanelRef.current) return

    gsap.to(UpcomingRidePanelRef.current, {
      transform: UpcomingRidePanel ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: UpcomingRidePanel ? 4 : 2,
    })
  }, [UpcomingRidePanel])

  // Animation for CofirmUpcomingRidePanel
  useGSAP(() => {
    // ensure the DOM node exists before animating (prevents GSAP "target null not found")
    if (!UpcomingRidePanelRef.current) return

    gsap.to(CofirmUpcomingRidePanelRef.current, {
      transform: CofirmUpcomingRidePanel ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: CofirmUpcomingRidePanel ? 4 : 2,
    })
  }, [CofirmUpcomingRidePanel])

  return (
    <div className='h-screen w-screen overflow-hidden relative'>
      <div className='flex absolute items-center '>
        <img className='w-17 mt-7 mb-8 ml-5' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
        <img className='w-6 ml-1' src="https://th.bing.com/th/id/R.7c9170d585fd3562fdf8ce1d49fd7410?rik=NleSh8FIn3wZzQ&riu=http%3a%2f%2fpngimg.com%2fuploads%2fuber%2fuber_PNG13.png&ehk=qmQ99VMq88QwqC5C9VL%2f7b9hZqS5EvFF0kDjGQLgyQE%3d&risl=&pid=ImgRaw&r=0" alt="Captain" />
      </div>

      {/* Home Button */}
      <Link
        to='/captain/logout'
        className='absolute right-2 top-6 h-8 w-8 bg-white flex items-center justify-center border-1 rounded-full'
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>

      {/* Map */}
      <div className='w-full h-2/3'>
        <img
          className='object-cover h-full w-full'
          src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI"
          alt="Map"
        />
      </div>

      {/*  Componants */}
      <CaptainDetails/>

      <UpcomingRidePopup 
        ref={UpcomingRidePanelRef} 
        setUpcomingRidePanel={setUpcomingRidePanel}
        setCofirmUpcomingRidePanel={setCofirmUpcomingRidePanel}
      />

      <CofirmUpcomingRidePopup 
        ref={CofirmUpcomingRidePanelRef} 
        setCofirmUpcomingRidePanel={setCofirmUpcomingRidePanel} 
      />
 
    </div>
  )
}

export default CaptainHome
