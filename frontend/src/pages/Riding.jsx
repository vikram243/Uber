import React, { useMemo, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext';
import LiveTracking from '../components/LiveTracking';

const Riding = () => {
  const vehicleImage = useMemo(() => localStorage.getItem('vehicleImage'), [])
  const location = useLocation();
  const ride = location.state?.ride;
  const { socket } = React.useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return; 
  
    const handleStartRide = () => {
      navigate('/user/home');
    };
    socket.on('ride-completed', handleStartRide);
  
    return () => {
      socket.off('ride-completed', handleStartRide); 
    };
  }, [socket]);

  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <img
        className='nav logo w-17 mt-7 ml-5 absolute z-1'
        src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png"
        alt="Uber"
      />

      {/* Home Button */}
      <Link
        to='/user/home'
        className='fixed right-2 top-6 h-7 w-7 z-1 bg-white flex items-center justify-center border-1 rounded-full'
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      {/* Map */}
      <div className='map h-screen w-screen relative z-0'>
        <LiveTracking
          alt="Map"
        />
      </div>

      {/* Ride Details */}
      <div className='absolute bottom-0 bg-white w-full p-4 rounded-t-lg shadow-lg z-2 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <img
            className='h-20 object-cover object-center'
            src={vehicleImage || "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"}
            alt="Selected Vehicle"
          />
          <div className='text-right'>
            <h2 className='text-sm font-medium capitalize'>{ride?.captainId?.fullname?.firstname + ' ' + ride?.captainId?.fullname?.lastname}</h2>
            <h4 className='text-lg font-semibold -mt-1 -mb-1'>{ride?.captainId?.vehicle?.plate}</h4>
            <p className='text-xs text-gray-600'>{ride?.captainId?.vehicle?.model}</p>
            <p className='text-xs text-gray-600'>{ride?.distance} Km</p>
          </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
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

          {/* Payment / End Ride */}
          <button
            className='w-full bg-green-500 mb-2 text-white font-medium p-2 rounded-lg'
            onClick={() => {
              alert("Payment flow not implemented yet 🚀")
            }}>
            {"Make a Payment"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Riding

