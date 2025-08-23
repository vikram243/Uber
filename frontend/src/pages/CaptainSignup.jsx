import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { CaptainDataContext } from '../context/CaptainDataContext'

const CaptainSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [color, setColor] = useState('')
  const [model, setModel] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [type, setType] = useState('')
  const [capacity, setCapacity] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  // Function to format the plate number
  // It formats the input to match the expected pattern (e.g., "MH 12 AB 1234")
  const formatPlateNumber = (input) => {
    let value = input.toUpperCase().replace(/[^A-Z0-9]/g, '')

    if (value.length > 2) value = value.slice(0, 2) + ' ' + value.slice(2)
    if (value.length > 5) value = value.slice(0, 5) + ' ' + value.slice(5)
    if (value.length > 8) value = value.slice(0, 8) + ' ' + value.slice(8, 12)

    return value
  }

  // Function to handle plate number input change
  // It formats the input value to match the expected plate number format
  const handlePlateChange = (e) => {
    const formattedValue = formatPlateNumber(e.target.value)
    setPlateNumber(formattedValue)
  }

  // Function to handle form submission
  // It sends a POST request to the server with the captain's details
  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password,
      vehicle: {
        color,
        model,
        plate: plateNumber,
        type,
        capacity
      },
    }

    await api.post(`/api/captains/register`, captainData)
      .then((response) => {
        if (response.status === 201) {
          const data = response.data
          setCaptain(data.captain)
          localStorage.setItem('token', data.token)
          navigate('/captain/home')
        }
      })
      .catch((error) => {
        console.error('Error registering captain:', error.response.data.message)
      })

    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setColor('')
    setModel('')
    setPlateNumber('')
    setType('')
    setCapacity('')
  }

  return (
    <div className='p-5 flex flex-col h-screen'>
      <div className='flex flex-col h-full'>
        <div className='flex items-center '>
          <img className='w-17 mt-2 mb-7' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
          <img className='w-6 ml-1 mb-4' src="https://th.bing.com/th/id/R.7c9170d585fd3562fdf8ce1d49fd7410?rik=NleSh8FIn3wZzQ&riu=http%3a%2f%2fpngimg.com%2fuploads%2fuber%2fuber_PNG13.png&ehk=qmQ99VMq88QwqC5C9VL%2f7b9hZqS5EvFF0kDjGQLgyQE%3d&risl=&pid=ImgRaw&r=0" alt="" />
        </div>
        <form
          onSubmit={submitHandler}
          className='flex flex-col justify-between h-full'
        >
          <div>
            <h2 className='mb-2 ml-2 font-semibold'>What's our captain's name</h2>
            <div className='flex gap-2'>
              <input
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-2'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                type="text"
                placeholder='First name'
              />
              <input
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-2'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                type="text"
                placeholder='Last name'
              />
            </div>

            <h2 className='mb-2 ml-2 font-semibold'>What's your email</h2>
            <input
              className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-full mb-2'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder='example@gmail.com'
            />

            <h3 className='mb-2 ml-2 font-semibold'>Enter password</h3>
            <input
              className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-full mb-2'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='Password'
            />

            <h2 className='mb-2 ml-2 font-semibold'>Vehicle info:</h2>
            <div className='flex gap-2'>
              <select
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-3'
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              >
                <option value="" disabled>Vehicle color</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Orange">Orange</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="Purple">Purple</option>
                <option value="Brown">Brown</option>
                <option value="Gray/Silver">Gray/Silver</option>
              </select>

              <input
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-3'
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                type="text"
                placeholder='Model'
              />
            </div>

            <div className='flex gap-2'>
              <input
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-3 tracking-widest text-center uppercase'
                value={plateNumber}
                onChange={handlePlateChange}
                required
                type="text"
                maxLength={13}
                placeholder='MH 12 AB 1234'
              />
              
              <select
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-1/2 mb-3'
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              >
                <option value="" disabled>Capacity</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className='flex w-1/2 pr-1 gap-2'>
              <select
                className='bg-[#eeeeee] py-2 px-4 border rounded-xl w-full mb-3'
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="" disabled>Vehicle type</option>
                <option value="Car">Car</option>
                <option value="Auto">Auto</option>
                <option value="Bike">Bike</option>
              </select>
            </div>
          </div>

          <div>
            <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl w-full'>Register</button>
            <p className='text-center'>Already you are a captain ? <Link to='/captain/login' className='text-blue-600'>Login here</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CaptainSignup
