import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'

const HomePage = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropOffLocation, setDropOffLocation] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
  const panelRef = useRef(null)
  const VehiclePanelRef = useRef(null)

  const submitHandler = (e) => {
    e.preventDefault()
  }

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        display: 'block',
        duration: 0.5,
        ease: 'power2.inOut',
      })
      gsap.to('.arrow', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
    else {
      gsap.to(panelRef.current, {
        height: '0%',
        display: 'none',
        duration: 0.5,
        ease: 'power2.inOut',
      })
      gsap.to('.arrow', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
  }, [panelOpen])

  useGSAP(() => {
    if (vehiclePanelOpen) {
      gsap.to(VehiclePanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
    else {
      gsap.to(VehiclePanelRef.current, {
        transform: 'translateY(100)',
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
  }, [vehiclePanelOpen])

  return (
    <div className='relative h-scrreen w-screen overflow-hidden'>
      <img className='w-17 mt-7 ml-5 absolute' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
      <div className='h-screen w-screen'
        onClick={() => setPanelOpen(false)}>
        <img className='object-cover h-full w-full' src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI" alt="Map" />
      </div>
      <div className='absolute w-full h-full flex flex-col justify-end top-0'>
        <div className='h-[30%] flex flex-col justify-center p-5 pt-0 rounded-t-lg shadow-lg bg-white relative'>
          <h2 className='arrow opacity-0 absolute top-0 left-2'>
            <i className="ri-arrow-down-s-line"
              onClick={() => setPanelOpen(false)}
            ></i>
          </h2>
          <h1 className='mb-4 text-2xl font-semibold'>Find a trip</h1>
          <form action="" onSubmit={(e) => {
            submitHandler(e)
          }} >
            <div class="flex flex-col items-center gap-1 h-16 justify-between absolute left-10 mt-4">
              <div class="w-1.5 h-1.5 border-2 border-black rounded-full"></div>
              <div class="w-0.5 flex-grow bg-black"></div>
              <div class="w-1.5 h-1.5 border-2 border-black"></div>
            </div>
            <input className='bg-[#e8e7e7] py-2 px-14 mb-4 rounded-lg w-full'
              value={pickupLocation}
              onClick={() => setPanelOpen(true)}
              onChange={(e) => setPickupLocation(e.target.value)}
              type="text"
              placeholder='Add a pickup location' />
            <input className='bg-[#e8e7e7] py-2 px-14 rounded-lg w-full'
              onClick={() => setPanelOpen(true)}
              value={dropOffLocation}
              onChange={(e) => setDropOffLocation(e.target.value)}
              type="text"
              placeholder='Enter your drop-off location' />
          </form>
        </div>
        <div ref={panelRef} className='h-0 px-5 bg-white display-none'>
          <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanelOpen={setVehiclePanelOpen} />
        </div>
      </div>
      <div  ref={VehiclePanelRef} className='absolute bottom-0 z-1 translate-y-full bg-white w-full p-4 flex flex-col gap-4 rounded-t-lg shadow-lg'>
        <h2 className='font-bold text-xl'>Choose a vehicle</h2>
        <div className='flex justify-between inset-shadow-zinc-950 active:bg-gray-300 bg-gray-200 rounded-lg items-center '>
          <img className='h-13 w-[33%]' src="https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png" alt="Car" />
          <div className=' w-[62%] p-2'>
            <h5 className='font-semibold'>UberGo <span><i className="ri-group-line"></i> 4</span></h5>
            <h6 className='text-sm font-medium'>2min away</h6>
            <p className='text-sm'>Affordable, compact ride</p>
          </div>
          <h2 className='font-mono mr-3'>₹193.30</h2>
        </div>
        <div className='flex justify-between inset-shadow-zinc-950 active:bg-gray-300 bg-gray-200 rounded-lg items-center '>
          <img className='h-13 w-[33%]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Car" />
          <div className=' w-[62%] p-2'>
            <h5 className='font-semibold'>Bike <span><i class="ri-user-line"></i> 1</span></h5>
            <h6 className='text-sm font-medium'>2min away</h6>
            <p className='text-sm'>Affordable, bike ride</p>
          </div>
          <h2 className='font-mono mr-3'>₹193.30</h2>
        </div>
        <div className='flex justify-between inset-shadow-zinc-950 active:bg-gray-300 bg-gray-200 rounded-lg items-center '>
          <img className='h-13 w-[33%]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="Car" />
          <div className=' w-[62%] p-2'>
            <h5 className='font-semibold'>Uber Auto <span><i className="ri-group-line"></i> 3</span></h5>
            <h6 className='text-sm font-medium'>2min away</h6>
            <p className='text-sm'>Affordable, compact ride</p>
          </div>
          <h2 className='font-mono mr-3'>₹193.30</h2>
        </div>
      </div>
    </div>
  )
}

export default HomePage
