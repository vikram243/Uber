import React from 'react'
import 'remixicon/fonts/remixicon.css'


const VehiclePanel = (props) => {
  return (
    <div ref={props.VehiclePanelRef} className='absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>
      <h2 className='font-bold text-xl'>Choose a vehicle</h2>
      <div className='flex justify-between inset-shadow-zinc-950 active:bg-gray-300 bg-gray-200 rounded-lg items-center '>
        <img className='h-13 w-[33%]' src="https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png" alt="Car" />
        <div className=' w-[62%] p-2'>
          <h5 className='font-semibold'>UberGo <span><i className="ri-group-line"></i> 4</span></h5>
          <h6 className='text-sm font-medium'>2min away</h6>
          <p className='text-sm'>Affordable, compact ride</p>
        </div>
        <h2 className='font-mono mr-3'>₹193.30</h2>
      </div>
      <div className='flex justify-between inset-shadow-zinc-950 active:bg-gray-300 bg-gray-200 rounded-lg items-center '>
        <img className='h-13 w-[33%]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Car" />
        <div className=' w-[62%] p-2'>
          <h5 className='font-semibold'>Bike <span><i className="ri-user-line"></i> 1</span></h5>
          <h6 className='text-sm font-medium'>2min away</h6>
          <p className='text-sm'>Affordable, bike ride</p>
        </div>
        <h2 className='font-mono mr-3'>₹193.30</h2>
      </div>
      <div className='flex justify-between inset-shadow-zinc-950 active:bg-gray-300 bg-gray-200 rounded-lg items-center '>
        <img className='h-13 w-[33%]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="Car" />
        <div className=' w-[62%] p-2'>
          <h5 className='font-semibold'>Uber Auto <span><i className="ri-group-line"></i> 3</span></h5>
          <h6 className='text-sm font-medium'>2min away</h6>
          <p className='text-sm'>Affordable, compact ride</p>
        </div>
        <h2 className='font-mono mr-3'>₹193.30</h2>
      </div>
    </div>
  )
}

export default VehiclePanel
