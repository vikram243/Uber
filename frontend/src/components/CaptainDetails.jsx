import React from 'react'

const CaptainDetails = (props) => {
  return (
    <div className='bg-white w-full overflow-hidden p-4 flex flex-col'>
      <div className='flex items-center gap-8 justify-around'>
        <img
          className='h-18 border-1 p-1 rounded-full border-gray-300 object-cover object-center'
          src={"https://www.pngall.com/wp-content/uploads/12/Driver-PNG-Clipart.png"}
          alt="Captain"
        />

        <div className='text-right'>
          <h2 className='text-lg font-medium text-blue-500 capitalize'>{props.captain?.fullname?.firstname + ' ' + props.captain?.fullname?.lastname || "Captain Name"}</h2>
          <h4 className='text-xm font-mono -mt-1 -mb-1'>₹{"295.36"}</h4>
          <p className='text-xs font-mono text-gray-600'>{"Earned"}</p>
        </div>
      </div>

      <div className='bg-gray-200 mt-5 rounded-md'>
        <div className='w-full flex justify-around items-center'>
          <div className='flex items-center gap-1 p-3 flex-col'>
            <i className="ri-timer-2-line text-gray-500 text-xl"></i>
            <div className='flex items-center flex-col'>
              <h3 className='text-sm font-semibold'>10.2</h3>
              <p className='text-xs text-gray-400'>{'Hours Online'}</p>
            </div>
          </div>

          <div className='flex items-center gap-1 p-3 flex-col'>
            <i className="ri-road-map-line text-gray-500 text-xl"></i>
            <div className='flex items-center flex-col'>
              <h3 className='text-sm font-semibold'>30 KM</h3>
              <p className='text-xs text-gray-400'>{'Total Distance'}</p>
            </div>
          </div>
          
          <div className='flex items-center gap-1 p-3 flex-col'>
            <i className="ri-booklet-line text-gray-500 text-xl"></i>
            <div className='flex items-center flex-col'>
              <h3 className='text-sm font-semibold'>39 Rides</h3>
              <p className='text-xs text-gray-400'>Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptainDetails
