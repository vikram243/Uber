import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserDataContext'


const UserSignup = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()

  // Function to handle form submission
  // It sends a POST request to the server with the user's details
  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password
    }
    await axios.post(`${BASE_URL}/users/register`, newUser)
      .then((response) => {
        if (response.status === 201) {
          const data = response.data
          setUserData(data.user)
          localStorage.setItem('token', data.token)
          navigate('/user/home')
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error.response.data.message)
      })

    setFirstName('')
    setLastName('')
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
          <h2 className='mb-2 ml-2 font-semibold'>What's your name</h2>
          <div className='flex gap-2'>
            <input className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-4'
              value={firstName}
              onChange={(e => setFirstName(e.target.value))}
              required
              type="text"
              placeholder='First name'
            />
            
            <input className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-4'
              value={lastName}
              onChange={(e => setLastName(e.target.value))}
              required
              type="text"
              placeholder='Last name'
            />
          </div>
          
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
          <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl w-full'>Create account</button>
          <p className='text-center'>Already have an account ? <Link to='/user/login' className='text-blue-600'>Login here</Link></p>
        </form>
      </div>
      <div>
        <p className='text-xs opacity-50'>By proceeding, you consent to receive emails, including automated messages, from us and our affiliates at the email address you provided.</p>
      </div>
    </div>
  )
}

export default UserSignup
