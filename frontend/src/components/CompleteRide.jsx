import React from 'react'
import { Link } from 'react-router-dom'

const CompleteRide = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className='bg-amber-500 w-full translate-y-full p-8 rounded-t-lg z-2 flex justify-between items-center absolute bottom-0'>
      <div className='flex flex-col text-center'>
        <h3>Distance</h3>
        <h1 className='text-xl font-bold'>4 Km Away</h1>
      </div>

      <div className='flex flex-col text-center'>
        <h4 className='font-mono'>Total Fare: ₹{'205'}</h4>
        <Link 
          to={'/captain/home'}
          className='bg-green-600 mt-2 text-white font-medium p-2 rounded-lg'>Complete Ride
        </Link>
      </div>
    </div>
  )
})

export default CompleteRide
