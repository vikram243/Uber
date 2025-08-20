import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

const Riding = () => {
  const navigate = useNavigate()
  const [ride, setRide] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ride')) } catch { return null }
  })
  const vehicleImage = useMemo(() => localStorage.getItem('vehicleImage'), [])

  // 🔹 Fetch latest ride once on mount (fix OTP missing after refresh)
  useEffect(() => {
    const fetchRide = async () => {
      try {
        if (ride?._id) {
          const { data } = await api.get(`/rides/${ride._id}`)
          setRide(data)
          localStorage.setItem('ride', JSON.stringify(data))
        }
      } catch (err) {
        console.error('Failed to fetch ride on mount', err)
      }
    }
    fetchRide()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once when component mounts

  // 🔹 Poll ride status every 5s
  useEffect(() => {
    if (!ride?._id) return
    let cancelled = false
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/rides/${ride._id}`)
        if (!cancelled) {
          setRide(data)
          localStorage.setItem('ride', JSON.stringify(data))
          if (data.status === 'completed') {
            clearInterval(interval)
            navigate('/user/home') // 👈 after ride ends, go back home
          }
        }
      } catch (err) {
        console.error('Failed to fetch ride updates', err)
      }
    }, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [ride?._id, navigate])

  return (
    <div className='h-screen w-screen'>
      {/* Home Button */}
      <Link
        to='/user/home'
        className='fixed right-2 top-2 h-8 w-8 bg-white flex items-center justify-center border-1 rounded-full'
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      {/* Map */}
      <div className='w-full h-1/2'>
        <img
          className='object-cover h-full w-full'
          src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI"
          alt="Map"
        />
      </div>

      {/* Ride Details */}
      <div className='bg-white w-full h-1/3 p-4 rounded-t-lg z-2 flex flex-col absolute top-0 translate-y-full'>
        <div className='flex items-center justify-between'>
          <img
            className='h-20 object-cover object-center'
            src={vehicleImage || "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"}
            alt="Selected Vehicle"
          />
          <div className='text-right'>
            <h2 className='text-sm font-medium capitalize'>{ride?.driver?.name || "Driver Assigned"}</h2>
            <h4 className='text-lg font-semibold -mt-1 -mb-1'>{ride?.vehicleNumber || "—"}</h4>
            <p className='text-xs text-gray-600'>{ride?.vehicleModel || "—"}</p>
            <h1 className='text-lg font-mono text-blue-800 mt-1.5'>{ride?.otp || "—"}</h1>
          </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-3'>
            <div className='flex items-center gap-5 p-3 border-b-1'>
              <i className="ri-map-pin-user-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Pickup</h3>
                <p className='text-sm -mt-1 text-gray-600'>{ride?.pickup || '-'}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-1'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Drop-off</h3>
                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination || '-'}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>₹{ride?.fare ?? '—'}</h3>
                <p className='text-sm text-gray-600'>Cash</p>
              </div>
            </div>
          </div>

          {/* Payment / End Ride */}
          <button
            className='w-full bg-green-500 mb-2 text-white font-medium p-2 rounded-lg'
            onClick={() => {
              alert("Payment flow not implemented yet 🚀")
            }}
          >
            {ride?.status === 'completed' ? "Ride Completed" : "Make a Payment"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Riding

