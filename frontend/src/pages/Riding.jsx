import React from 'react'
import { Link, Links } from 'react-router-dom'

const Riding = (props) => {
  return (
    <div className='h-screen w-screen'>
      <Link to='/user/home' className='fixed right-2 top-2 h-8 w-8 bg-white flex items-center justify-center border-1 rounded-full'>
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className='w-full h-1/2'>
        <img className='object-cover h-full w-full' src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI" alt="Map" />
      </div>

      <div className='bg-white w-full h-1/2 p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <img className='h-20 object-cover object-center' src={props.selectedVehicleImage || "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"} alt="Selected Vehicle" />
          <div className='text-right'>
            <h2 className='text-sm font-medium capitalize'>Pankaj</h2>
            <h4 className='text-lg font-semibold -mt-1 -mb-1'>MP04 AN 2004</h4>
            <p className='text-xs text-gray-600'>Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-3'>
            <div className='flex items-center gap-5 p-3 border-b-1'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Drop-off</h3>
                <p className='text-sm -mt-1 text-gray-600'>Sigma library 80feet road, Bhopal</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>₹193.23 </h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
              </div>
            </div>
          </div>
          <button className='w-full bg-green-500 text-white font-medium p-2 rounded-lg'>Make a Payment</button>
        </div>
      </div>
    </div>
  )
}

export default Riding
