import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'

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
        transform: 'translateY(0%)',
        duration: 0.5,
        ease: 'power2.inOut',
        zIndex: 3,
      })
      gsap.to('.map', {
        zIndex: 3,
      })
      gsap.to('.logo', {
        zIndex: 4,
      })
    }
    else {
      gsap.to(VehiclePanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.5,
        ease: 'power2.inOut',
        zIndex: 2,
      })
      gsap.to('.map', {
        zIndex: 1,
      })
      gsap.to('.logo', {
        zIndex: 2,
      })
    }
  }, [vehiclePanelOpen])

  return (
    <div className='relative h-scrreen w-screen overflow-hidden'>
      <img className='logo w-17 mt-7 ml-5 absolute z-2' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
      <div className='map h-screen w-screen relative z-1'
        onClick={() => setVehiclePanelOpen(false)}>
        <img className='object-cover h-full w-full' src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI" alt="Map" />
      </div>
      <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanelOpen={setVehiclePanelOpen} panelRef={panelRef} submitHandler={submitHandler} pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} dropOffLocation={dropOffLocation} setDropOffLocation={setDropOffLocation} />
      <VehiclePanel VehiclePanelRef={VehiclePanelRef} />
    </div>
  )
}

export default HomePage