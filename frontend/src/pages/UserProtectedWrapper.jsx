import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserDataContext'
import api from '../lib/api'

const UserProtectedWrapper = ({
  children
}) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { setUserData } = useContext(UserDataContext)
  const [, setLoading] = useState(true)

  // Effect to check if the token is valid and fetch user data
  // If the token is invalid or not present, it redirects to the home page
  useEffect(() => {
    if (!token || token === undefined || token === null) {
      navigate('/')
    }

    // Function to fetch user data
    // It sends a GET request to the server with the token in the headers
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
        if (response.status === 200) {
          // backend returns { message, user } — store the user object
          setUserData(response.data.user)
          localStorage.setItem('_UserId', response.data.user._id)
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('_UserId')
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching user data:', error?.response?.data?.message, error?.message)
        localStorage.removeItem('token')
        localStorage.removeItem('_UserId')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [token, navigate, setUserData])

  return (
    <>
      {children}
    </>
  )
}

export default UserProtectedWrapper
