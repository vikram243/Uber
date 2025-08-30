import React, { useState } from 'react'
import { CaptainDataContext } from '../context/CaptainDataContext';
import api from '../lib/api';

const VerifyOtp = React.forwardRef((props, ref) => {
  const { ride, setOtpPanel, setRideDetailsPanel, setCompleteRide } = props;
  const { captain } = React.useContext(CaptainDataContext);
  const [otp, setOtp] = useState('')
  const verifyOtp = async () => {
    const rideId = ride._id
    const captainId = localStorage.getItem('_CaptainId') || captain._id
    if (!rideId || !captainId) {
      console.error('Missing rideId or captainId');
      return;
    }
    const response = await api.post('api/rides/start-ride', { rideId, captainId, otp });
    if (response.data.success) {
      setRideDetailsPanel(false);
      setOtpPanel(false);
      setCompleteRide(true);
    } else {
      console.error('Error confirming ride:', response?.data?.message, response?.message);
      return;
    }
  }

  return (
    <div ref={ref} className='bg-white w-full translate-y-full p-4 rounded-t-lg z-2 flex flex-col absolute bottom-0'>
      <h2 className='text-lg font-medium capitalize'>{"Verify OTP To Continue"}</h2>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className='flex flex-col gap-4 mt-4'>
          <input
            type='text'
            placeholder='Enter OTP'
            className='border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            className='bg-blue-500 text-white font-medium p-2 rounded-lg'>Verify
          </button>

          <button
            onClick={() => { props.setOtpPanel(false); props.setRideDetailsPanel(true) }}
            className='text-blue-500 font-medium text-sm'>Back
          </button>
        </div>
      </form >
    </div >
  )
})

export default VerifyOtp
