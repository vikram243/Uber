import React from 'react'

const VerifyOtp = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className='bg-white w-full translate-y-full p-4 rounded-t-lg z-2 flex flex-col absolute bottom-0'>
      <h2 className='text-lg font-medium capitalize'>{"Verify OTP To Continue"}</h2>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className='flex flex-col gap-4 mt-4'>
          <input
            type='text'
            placeholder='Enter OTP' 
            className='border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />

          <button
            onClick={() => {props.setOtpPanel(false); props.setCompleteRide(true)}}
            className='bg-blue-500 text-white font-medium p-2 rounded-lg'>Verify
          </button>
          
          <button 
            onClick={() => {props.setOtpPanel(false); props.setRideDetailsPanel(true)}}
            className='text-blue-500 font-medium text-sm'>Back
          </button>
        </div>
      </form>
    </div>
  )
})

export default VerifyOtp
