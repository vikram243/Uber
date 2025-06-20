import React from 'react'

const LookingForDriver = (props) => {
  return (
    <div ref={props.WaitingForDriverPannelRef} className='absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>
      
      <div className='flex items-center justify-between'>
        <img className='h-20 object-cover object-center' src={props.selectedVehicleImage || "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"} alt="Selected Vehicle" />
        <div className='text-right'>
          <h2 className='text-sm font-medium capitalize'>Pankaj</h2>
          <h4 className='text-lg font-semibold -mt-1 -mb-1'>MP04 AN 2004</h4>
          <p className='text-xs text-gray-600'>Maruti Suzuki Alto</p>
          <h1 className='text-lg font-mono text-blue-800 mt-1.5'>247864</h1>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-3'>
          <div className='flex items-center gap-5 p-3 border-b-1'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>Bada talab Bhopal</p>
            </div>
          </div>
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
        <button className='w-full bg-red-500 text-white font-medium p-2 rounded-lg'
          onClick={() => { props.setWaitingForDriverPannel(false) }}>Cancel Ride</button>
      </div>
    </div>
  )
}

export default LookingForDriver
