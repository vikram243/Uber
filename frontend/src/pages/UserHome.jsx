import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Link, useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import api from '../lib/api'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserDataContext'

const UserHome = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropOffLocation, setDropOffLocation] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)   // for LookingForDriver
  const [selectedVehicleImage, setSelectedVehicleImage] = useState(null)
  const [ride, setRide] = useState(null)
  const [WaitingForDriverPannel, setWaitingForDriverPannel] = useState(false)
  const { sendMessage } = React.useContext(SocketContext)
  const { userData } = React.useContext(UserDataContext)

  // only send join when we have a userId
  useEffect(() => {
    if (!userData?._id) return
    sendMessage('join', { userId: userData._id, role: 'user' })
  }, [sendMessage, userData])

  const panelRef = useRef(null)
  const VehiclePanelRef = useRef(null)
  const VehicleFoundPanelRef = useRef(null)
  const WaitingForDriverPannelRef = useRef(null)

  // Navigate hook to redirect after ride ends
  // It will be used in the Riding component to navigate back to home
  const navigate = useNavigate()

  // Function to handle form submission
  // It prevents the default form submission behavior
  const submitHandler = (e) => {
    e.preventDefault()
  }

  // Vehicle panel animation
  useGSAP(() => {
    gsap.to(VehiclePanelRef.current, {
      transform: vehiclePanelOpen ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: vehiclePanelOpen ? 3 : 2,
    })
  }, [vehiclePanelOpen])

  // LookingForDriver panel animation
  useGSAP(() => {
    gsap.to(VehicleFoundPanelRef.current, {
      transform: vehicleFound ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: vehicleFound ? 4 : 2,
    })
  }, [vehicleFound])

  // Search panel animation
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '70%' : '0%',
      display: panelOpen ? 'block' : 'none',
      duration: 0.5,
      ease: 'power2.inOut',
    })
    gsap.to('.nav', {
      zIndex: panelOpen ? 2 : 3,
    })
    gsap.to('.arrow', {
      opacity: panelOpen ? 1 : 0,
      duration: 0.5,
      ease: 'power2.inOut',
    })
  }, [panelOpen])

  // WaitingForDriver panel animation
  useGSAP(() => {
    gsap.to(WaitingForDriverPannelRef.current, {
      transform: WaitingForDriverPannel ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: WaitingForDriverPannel ? 4 : 2,
    })
  }, [WaitingForDriverPannel])

  // 🔹 Poll ride status when WaitingForDriver is open
  useEffect(() => {
    if (!ride?._id || !WaitingForDriverPannel) return
    let cancelled = false
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/api/rides/${ride._id}`)
        if (!cancelled) {
          setRide(data)
          if (data.status === 'in_progress') {
            clearInterval(interval)
            navigate('/riding')  // ✅ only after OTP verified
          }
        }
      } catch (err) {
        console.error('Polling ride failed', err)
      }
    }, 4000)

    return () => { cancelled = true; clearInterval(interval) }
  }, [ride?._id, WaitingForDriverPannel, navigate])

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <img
        className='nav logo w-17 mt-7 ml-5 absolute z-3 '
        src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png"
        alt="Uber"
      />

      <Link
        to='/user/logout'
        className='nav absolute right-2 z-3 top-6 h-8 w-8 bg-white flex items-center justify-center border-1 rounded-full'
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>

      {/* Map */}
      <div className='map h-screen w-screen relative z-1' onClick={() => setVehiclePanelOpen(false)}>
        <img
          className='object-cover h-full w-full'
          src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI"
          alt="Map"
        />
      </div>

      {/* Location Search */}
      <LocationSearchPanel
        setPanelOpen={setPanelOpen}
        setVehiclePanelOpen={setVehiclePanelOpen}
        panelRef={panelRef}
        submitHandler={submitHandler}
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        dropOffLocation={dropOffLocation}
        setDropOffLocation={setDropOffLocation}
      />

      {/* Vehicle Select Panel */}
      <VehiclePanel
        VehiclePanelRef={VehiclePanelRef}
        setVehiclePanelOpen={setVehiclePanelOpen}
        setVehicleFound={setVehicleFound}
        setSelectedVehicleImage={setSelectedVehicleImage}
        pickupLocation={pickupLocation}
        dropOffLocation={dropOffLocation}
        onRideCreated={(r) => {
          setRide(r)
          setVehicleFound(true) // show LookingForDriver
        }}
      />

      {/* Looking For Driver */}
      <LookingForDriver
        VehicleFoundPanelRef={VehicleFoundPanelRef}
        setVehicleFound={setVehicleFound}
        selectedVehicleImage={selectedVehicleImage}
        ride={ride}
        onCancel={async () => {
          try {
            const resp = await api.post(`/api/rides/${ride?._id}/cancel`)
            if (resp.status === 200) {
              setRide(null)
              setVehicleFound(false)
            }
          } catch (err) {
            console.error('Failed to cancel ride', err)
          }
        }}
        onAccepted={(updatedRide) => {
          setRide(updatedRide)
          setVehicleFound(false)          // close LookingForDriver
          setWaitingForDriverPannel(true) // open WaitingForDriver
          // ❌ no navigate here
        }}
      />

      {/* Waiting For Driver */}
      <WaitingForDriver
        WaitingForDriverPannelRef={WaitingForDriverPannelRef}
        setWaitingForDriverPannel={setWaitingForDriverPannel}
        selectedVehicleImage={selectedVehicleImage}
        ride={ride}
      />
    </div>
  )
}

export default UserHome