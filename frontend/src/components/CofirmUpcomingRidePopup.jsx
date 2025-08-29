import React from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap/dist/gsap';
import { useState } from 'react';

const CofirmUpcomingRidePopup = React.forwardRef((props, ref) => {
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
    <div ref={ref} className='absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>

      {/* Toggle Button */}
      <i
        onClick={togglePanel}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-xl ri-git-commit-line cursor-pointer"
      ></i>

      <div className='flex p-2 items-center gap-8 justify-around bg-gray-200 rounded mt-2'>
        <img className='h-20 border-1 rounded-full border-gray-300 object-cover object-center' src={"https://png.pngtree.com/png-clipart/20230814/original/pngtree-cute-cartoon-girls-face-vector-png-image_10354397.png"} alt="Passanger" />
        <div className='text-right'>
          <h2 className='text-lg font-medium capitalize'>{"Confirm This Ride To Go!"}</h2>
          <h4 className='text-sm font-semibold mt-1 capitalize'>{props.ride?.userId?.fullname?.firstname + ' ' + props.ride?.userId?.fullname?.lastname || "Costumer Name"}</h4>
          <p className='text-sm font-mono text-blue-600 mt-1'>₹{props.ride?.fare || "fare"}</p>
          <h1 className='text-sm font-mono text-gray-800 -mt-1'>{props.ride?.distance} Km</h1>
        </div>
      </div>

      <div className='h-full flex gap-2 justify-between flex-col items-center'>
        <div className='w-full'>
          <div className='flex items-center gap-5 border-gray-300 p-3 border-b-1'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-normal'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 border-gray-300 p-3 border-b-1'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-normal'>Drop-off</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 border-gray-300 p-3 border-b-1'>
            <i className="ri-sticky-note-line"></i>
            <div>
              <h3 className='text-lg font-normal'>Note</h3>
              <p className='text-sm -mt-1 text-gray-600'>{'Give note what you want'}</p>
            </div>
          </div>
        </div>

        <div className='w-full'>
          <div className='w-full flex flex-col border-gray-300 p-3'>
            <h3 className='text-lg font-normal mb-2'>Trip Fare Breakup</h3>

            <div className='flex justify-between'>
              <p className='text-sm text-gray-600'>Phone Pay</p>
              <p className='text-sm text-gray-600'>
                ₹{props.ride?.fare ? (props.ride.fare * 0.83).toFixed(2) : "0.00"}
              </p>
            </div>

            <div className='flex justify-between'>
              <p className='text-sm text-gray-600'>Extra Amount</p>
              <p className='text-sm text-gray-600'>
                ₹{props.ride?.fare ? (props.ride.fare * 0.17).toFixed(2) : "0.00"}
              </p>
            </div>

            <div className='flex justify-between'>
              <p className='text-sm text-gray-600'>Total Payment</p>
              <p className='text-sm text-gray-600'>
                ₹{props.ride?.fare || "0.00"}
              </p>
            </div>
          </div>


          <div className='w-full flex items-center justify-between'>
            <Link 
              onClick={() => props.cancelRide()}
              className='bg-red-500 text-center text-white font-bold px-4 py-2 rounded-lg'><i className="ri-close-circle-line"></i>
            </Link>
            <Link 
              to={"/captain/riding"}
              state={{ ride: props.ride }}
              onClick={() => props.setCofirmUpcomingRidePanel(false)}
              className='w-full bg-yellow-500 text-center text-white font-medium p-2 rounded-lg ml-2'>Go to Pickup Location <i className="ri-map-pin-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CofirmUpcomingRidePopup
