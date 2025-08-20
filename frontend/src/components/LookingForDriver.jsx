import React, { useEffect } from 'react'
import api from '../lib/api'

const LookingForDriver = (props) => {
  const ride = props.ride

  useEffect(() => {
    if (!ride?._id) return
    let cancelled = false
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/rides/${ride._id}`)
        if (!cancelled && data?.status === 'accepted') {
          props.onAccepted && props.onAccepted(data)
        }
      }
      catch {
        // Handle error if needed
      }
    }, 3000)
    return () => { cancelled = true; clearInterval(interval) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride?._id])

  return (
    <div ref={props.VehicleFoundPanelRef} className='absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>
      <h3 className='text-2xl font-semibold mb-3'>Looking for a Driver</h3>
      <div className='flex gap-2 justify-between flex-col items-center'>
        <img className='h-20 object-cover object-center' src={props.selectedVehicleImage || "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"} alt="Selected Vehicle" />
        <div className="absolute top-9 right-22 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
        </div>
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
              <h3 className='text-lg font-medium'>₹{ride?.fare ?? '—'} </h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash</p>
            </div>
          </div>
        </div>
        <button className='w-full bg-red-500 text-white font-medium p-2 rounded-lg'
          onClick={props.onCancel}>Cancel Ride</button>
      </div>
    </div>
  )
}

export default LookingForDriver
