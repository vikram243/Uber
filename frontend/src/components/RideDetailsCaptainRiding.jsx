import React from 'react'
import { Link } from 'react-router-dom';
import { gsap } from 'gsap/dist/gsap';
import { useState } from 'react';

const RideDetailsCaptainRiding = React.forwardRef((props, ref) => {
  const { ride } = props;
  const [isUp, setIsUp] = useState(false); // track panel position

  // Function to toggle position
  const togglePanel = () => {
    if (!ref.current) return;
    if (!isUp) {
      gsap.to(ref.current, {
        bottom: "-55%", // move down
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(ref.current, {
        bottom: "0%", // move back
        duration: 0.5,
        ease: "power2.out",
      });
    }
    setIsUp(!isUp); // toggle state
  };

  return (
    <div
      ref={ref}
      className='bg-white w-full min-h-4/5 translate-y-full p-4 rounded-t-lg z-2 flex flex-col absolute bottom-0'>

      {/* Toggle Button */}
      <i
        onClick={togglePanel}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-xl ri-git-commit-line cursor-pointer"
      ></i>

      <div className='flex flex-col mt-2'>
        <h2 className='text-lg font-medium capitalize'>{"Ride Details:"}</h2>
        <div className='flex items-center justify-between mt-2'>
          <h4 className='text-sm font-semibold -mt-1 -mb-1 capitalize'>{ride?.userId?.fullname?.firstname + ' ' + ride?.userId?.fullname?.lastname || "Costumer Name"}</h4>
          <p className='text-sm font-mono text-blue-600'>{ride?.distance} Km</p>
        </div>
      </div>

      <div className='h-full flex flex-col justify-between items-center'>
        <div className='w-full mt-3'>
          <div className='flex items-center gap-5 p-3 border-b-1'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{ride?.pickup}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3 border-b-1'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Drop-off</h3>
              <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
              <p className='text-sm text-gray-600'>Cash</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {props.setOtpPanel(true); props.setRideDetailsPanel(false)}}
          className='w-[90%] absolute bottom-5 bg-green-500 mb-2 text-white font-medium p-2 rounded-lg'>
          {"Start Ride"}
        </button>
      </div>
    </div>
  )
})

export default RideDetailsCaptainRiding
