import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserDataContext'
import api from '../lib/api'

const UserLogin = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const userData = {
      email,
      password
    }
    
    try {
      const response = await api.post(`/users/login`, userData)
      if (response.status === 200) {
        const data = response.data
        setUserData(data.user)
        localStorage.setItem('token', data.token)
        navigate('/user/home')
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message
      console.error('Error logging in:', msg)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-5 flex flex-col justify-between h-screen'>
      <div>
        <img className='w-17 mt-2 mb-7' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
        <form action=""
          onSubmit={submitHandler}
        >
          <h2 className='mb-2 ml-2 font-semibold'>What's your email</h2>
          <input className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-full mb-4'
            value={email}
            onChange={(e => setEmail(e.target.value))}
            required
            type="email"
            placeholder='example@gmail.com'
          />
          <h3 className='mb-2 ml-2 font-semibold'>Enter password</h3>
          <input className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-full mb-7'
            value={password}
            onChange={(e => setPassword(e.target.value))}
            required
            type="password"
            placeholder='Password'
          />
          <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl w-full'>Login</button>
          <p className='text-center'>New here ? <Link to='/user/signup' className='text-blue-600'>Create an account</Link></p>
        </form>
      </div>
      <div>
        <Link to='/captain/login' className='bg-emerald-500 text-white flex items-center justify-center font-semibold py-2 px-4 rounded-xl w-full mb-2'>Sign in as captain</Link>
      </div>
    </div>
  )
}

export default UserLogin
