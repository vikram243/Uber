import React, { useEffect } from 'react'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {

  // Retrieve the token from localStorage
  // It will be used to authenticate the logout request
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // Effect to handle logout
  // It sends a GET request to the server to log out the user
  useEffect(() => {
    const doLogout = async () => {
      try {
        const response = await api.get(`/api/users/logout`, {
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

export default UserLogout
