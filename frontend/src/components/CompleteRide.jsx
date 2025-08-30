import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainDataContext';
import api from '../lib/api';

const CompleteRide = React.forwardRef((props, ref) => {
  const { captain } = React.useContext(CaptainDataContext);
  const { ride, setCompleteRide } = props;
  const navigate = useNavigate();

  const completeRide = async () => {
    const rideId = ride._id
    const captainId = localStorage.getItem('_CaptainId') || captain._id
    if (!rideId || !captainId) {
      console.error('Missing rideId or captainId');
      return;
    }
    const response = await api.post('api/rides/complete-ride', { rideId, captainId});
    if (response.data.success) {
      setCompleteRide(false);
      navigate('/captain/home');
    } else {
      console.error('Error cmpleting ride:', response?.data?.message, response?.message);
      return;
    }
  }

  return (
    <div ref={ref} className='bg-amber-500 w-full translate-y-full p-6 rounded-t-lg z-1 absolute bottom-0'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col text-center'>
          <h3>Total Distance</h3>
          <h1 className='text-xl font-bold'>{ride?.distance}Km</h1>
        </div>

        <div className='flex flex-col text-center'>
          <h4 className='font-bold'>Total Fare: ₹{ride?.fare}</h4>
          <Link 
            onClick={completeRide}
            className='bg-green-600 mt-2 text-white font-medium p-2 rounded-lg'>Complete Ride
          </Link>
        </div>
      </div>
      <h3 className='font-medium mt-4 text-center'><i className="text-lg ri-map-pin-2-fill"></i> {ride?.destination}</h3>
    </div>
  )
})

export default CompleteRide
