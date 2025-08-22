import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserDataContext'
import axios from 'axios'

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
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
        if (response.status === 200) {
          // backend returns { message, user } — store the user object
          setUserData(response.data.user)
        } else {
          localStorage.removeItem('token')
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        localStorage.removeItem('token')
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
