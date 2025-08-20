import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const doLogout = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        if (response.status === 200) {
          localStorage.removeItem('token')
          navigate('/')
        }
      } catch (error) {
        console.error('Error logging out:', error?.response?.data?.message || error.message)
        localStorage.removeItem('token')
        navigate('/')
      }
    }
    doLogout()
  }, [token, navigate])

  return (
    <div>
            UserLogout
    </div>
  )
}

export default CaptainLogout
