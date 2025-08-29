import React, { useEffect, useMemo, useState, useRef } from 'react'
import 'remixicon/fonts/remixicon.css'
import api from '../lib/api'

const VehiclePanel = (props) => {
  const [fares, setFares] = useState({ car: null, bike: null, auto: null })
  const [fareError, setFareError] = useState('')
  const [attemptedQuote, setAttemptedQuote] = useState(false)
  const [isQuoting, setIsQuoting] = useState(false)
  const canQuote = useMemo(() => Boolean(props.pickupLocation && props.dropOffLocation), [props.pickupLocation, props.dropOffLocation])
  const abortRef = useRef(null)
  const timeoutRef = useRef(null)

  // Fetch fares when pickup or drop-off changes
  useEffect(() => {
    let cancelled = false
    const computeFares = async () => {
      try {
        setFareError('')
        setIsQuoting(true)
        if (abortRef.current) abortRef.current.abort()
        const controller = new AbortController()
        abortRef.current = controller
        const { data } = await api.get('/api/maps/distanceTime', {
          params: {
            origin: props.pickupLocation,
            destination: props.dropOffLocation,
          },
          signal: controller.signal,
        })
        const duration = parseFloat(String(data.duration).replace(/[^0-9.]/g, ''))
        const distance = parseFloat(String(data.distance).replace(/[^0-9.]/g, ''))
        const car = Number((distance * 13 + duration * 0.6).toFixed(2))
        const bike = Number((distance * 7 + duration * 0.5).toFixed(2))
        const auto = Number((distance * 10 + duration * 0.3).toFixed(2))
        if (!cancelled) {
          setFares({ car, bike, auto })
          setIsQuoting(false)
        }
      } catch (err) {
        if (err?.name === 'CanceledError') return
        if (!cancelled) {
          setFares({ car: null, bike: null, auto: null })
          const msg = err?.response?.data?.message || 'No rides available for the selected locations'
          setFareError(msg)
          setIsQuoting(false)
        }
      }
    }
    const isSpecific = (s) => typeof s === 'string' && s.trim().length > 5
    if (!canQuote) {
      setFares({ car: null, bike: null, auto: null })
      setFareError('')
      setAttemptedQuote(false)
      setIsQuoting(false)
      if (abortRef.current) abortRef.current.abort()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    } else if (!(isSpecific(props.pickupLocation) && isSpecific(props.dropOffLocation))) {
      setAttemptedQuote(true)
      setFares({ car: null, bike: null, auto: null })
      setFareError('No rides available for the selected locations')
      setIsQuoting(false)
      if (abortRef.current) abortRef.current.abort()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    } else {
      setAttemptedQuote(true)
      setIsQuoting(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => { computeFares() }, 350)
    }
    return () => { cancelled = true }
  }, [canQuote, props.pickupLocation, props.dropOffLocation])

  // Create ride with selected vehicle type and image
  const createRide = async (vehicleType, vehicleImage) => {
    try {
      const { data } = await api.post('/api/rides/create', {
        pickup: props.pickupLocation,
        destination: props.dropOffLocation,
        vehicleType,
      })
      try {
        localStorage.setItem('ride', JSON.stringify(data))
        localStorage.setItem('vehicleImage', vehicleImage)
      } catch (err) {
        console.error('Failed to persist ride', err)
      }
      props.onRideCreated && props.onRideCreated(data)
      props.setVehiclePanelOpen(false)
      props.setVehicleFound(true) // this opens LookingForDriver
      props.setSelectedVehicleImage(vehicleImage)
      // ❌ removed navigate('/riding')
    } catch (err) {
      const msg = err?.response?.data?.error || err.message
      console.error('Failed to create ride', msg)
    }
  }

  // Check if no rides are available
  const noRidesAvailable = attemptedQuote && !isQuoting && (!!fareError || (fares.car === null && fares.bike === null && fares.auto === null))

  return (
    <div ref={props.VehiclePanelRef} className='absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-1 flex flex-col gap-4'>
      <i className="ri-arrow-down-s-line absolute right-4"
        onClick={() => props.setVehiclePanelOpen(false)}
      ></i>

      {noRidesAvailable && (
        <div className='flex justify-between h-38 bg-gray-200 rounded-lg items-center mt-8 p-4'>
          <i className="ri-error-warning-line text-xl mr-3 text-red-500"></i>
          <div className='w-full text-center'>
            <h5 className='font-semibold'>No rides available</h5>
            <p className='text-sm text-gray-600'>Try more specific, nearby addresses</p>
          </div>
        </div>
      )}

      {isQuoting && (
        <div className='text-xl h-56 text-gray-500'>Fetching fares…</div>
      )}

      {!noRidesAvailable && !isQuoting && fareError && (
        <div className='text-xs text-red-600'>{fareError}</div>
      )}
      
      {(canQuote && !noRidesAvailable && !isQuoting) && (
        <>
          <h2 className='font-bold text-xl'>Choose a vehicle</h2>
          <div onClick={() => fares.car ? createRide('car', "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png") : null} className={`flex justify-between inset-shadow-zinc-950 ${fares.car ? 'active:bg-gray-300' : 'opacity-60 pointer-events-none'} bg-gray-200 rounded-lg items-center`}>
            <img className='h-13 w-[33%]' src="https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png" alt="Car" />
            <div className='w-[62%] p-2'>
              <h5 className='font-semibold'>UberGo <span><i className="ri-group-line"></i> 4</span></h5>
              <h6 className='text-sm font-medium'>2min away</h6>
              <p className='text-sm'>Affordable, compact ride</p>
            </div>
            <h2 className='font-mono mr-3'>₹{fares.car ?? '—'}</h2>
          </div>

          <div onClick={() => fares.bike ? createRide('bike', "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png") : null} className={`flex justify-between inset-shadow-zinc-950 ${fares.bike ? 'active:bg-gray-300' : 'opacity-60 pointer-events-none'} bg-gray-200 rounded-lg items-center`}>
            <img className='h-13 w-[33%]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Bike" />
            <div className='w-[62%] p-2'>
              <h5 className='font-semibold'>Bike <span><i className="ri-user-line"></i> 1</span></h5>
              <h6 className='text-sm font-medium'>2min away</h6>
              <p className='text-sm'>Affordable, bike ride</p>
            </div>
            <h2 className='font-mono mr-3'>₹{fares.bike ?? '—'}</h2>
          </div>

          <div onClick={() => fares.auto ? createRide('auto', "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png") : null} className={`flex justify-between inset-shadow-zinc-950 ${fares.auto ? 'active:bg-gray-300' : 'opacity-60 pointer-events-none'} bg-gray-200 rounded-lg items-center`}>
            <img className='h-13 w-[33%]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="Auto" />
            <div className='w-[62%] p-2'>
              <h5 className='font-semibold'>Uber Auto <span><i className="ri-group-line"></i> 3</span></h5>
              <h6 className='text-sm font-medium'>2min away</h6>
              <p className='text-sm'>Affordable, compact ride</p>
            </div>
            <h2 className='font-mono mr-3'>₹{fares.auto ?? '—'}</h2>
          </div>
        </>
      )}
    </div>
  )
}

export default VehiclePanel