import React from 'react'

const UpcomingRidePopup = React.forwardRef((props, ref) => {

  return (
    <div ref={ref} className='absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>
      <div className='flex p-2 items-center gap-8 justify-around bg-gray-200 rounded'>
        <img className='h-20 border-1 rounded-full border-gray-300 object-cover object-center' src={"https://png.pngtree.com/png-clipart/20230814/original/pngtree-cute-cartoon-girls-face-vector-png-image_10354397.png"} alt="Passanger" />
        <div className='text-right'>
          <h2 className='text-lg font-medium capitalize'>{"Upcoming Ride!"}</h2>
          <h4 className='text-sm font-semibold mt-1 capitalize'>{props.ride?.userId.fullname.firstname + ' ' + props.ride?.userId.fullname.lastname}</h4>
          <p className='text-sm font-mono text-blue-600'>₹{props.ride?.fare}</p>
          <h4 className='text-sm font-mono capitalize'>{props.ride?.distance} Km</h4>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full'>
          <div className='flex items-center gap-5 border-gray-300 p-3 border-b-1'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-normal'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600 capitalize'>{props.ride?.pickup}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 border-gray-300 p-3 border-b-1'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-normal'>Drop-off</h3>
              <p className='text-sm -mt-1 text-gray-600 capitalize'>{props.ride?.destination}</p>
            </div>
          </div>
        </div>

        <div className='mt-4 w-full flex items-center justify-between'>
          <button 
            onClick={() => props.setUpcomingRidePanel(false)}
            className='w-full bg-gray-500 text-white font-medium p-2 rounded-lg'>Ignore
          </button>
          <button 
            onClick={() => {props.confirmRide()}}
            className='w-full bg-green-500 text-white font-medium p-2 rounded-lg ml-2'>Accept
          </button>
        </div>
      </div>
    </div>
  )
})

export default UpcomingRidePopup
