import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainDataContext'
import api from '../lib/api'


const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  // Function to handle form submission
  // It sends a POST request to the server with the captain's email and password
  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      email,
      password
    }

    await api.post(`/api/captains/login`, captainData)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data
          setCaptain(data.captain)
          localStorage.setItem('token', data.token)
          navigate('/captain/home')
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error?.response?.data?.message, error?.message)
      })

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-5 flex flex-col justify-between h-screen'>
      <div>
        <div className='flex items-center '>
          <img className='w-17 mt-2 mb-7' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
          <img className='w-6 ml-1 mb-4' src="https://th.bing.com/th/id/R.7c9170d585fd3562fdf8ce1d49fd7410?rik=NleSh8FIn3wZzQ&riu=http%3a%2f%2fpngimg.com%2fuploads%2fuber%2fuber_PNG13.png&ehk=qmQ99VMq88QwqC5C9VL%2f7b9hZqS5EvFF0kDjGQLgyQE%3d&risl=&pid=ImgRaw&r=0" alt="Captain" />
        </div>
        <form action=""
          onSubmit={submitHandler}
        >
          <h2 className='mb-2 ml-2 font-semibold'>Captain's email</h2>
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
          <p className='text-center'>Join a fleet ? <Link to='/captain/signup' className='text-blue-600'>Register as a captain</Link></p>
        </form>
      </div>
      <div>
        <Link to='/user/login' className='bg-amber-600 text-white flex items-center justify-center font-semibold py-2 px-4 rounded-xl w-full mb-2'>Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin
