import React from 'react'
import { Link } from 'react-router-dom'
import BgUber from '../assets/BgUber.png'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center h-screen w-screen flex justify-between flex-col' style={{ backgroundImage: `url(${BgUber})` }}>
        <img className='w-17 ml-5 mt-7' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
        <div className='bg-white py-4 px-6 flex flex-col items-center justify-center'>
          <h2 className='text-3xl font-bold mb-4'>Get started with Uber</h2>
          <Link to='/user/login' className='w-full flex items-center justify-center bg-black text-white py-2 rounded-xl'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start