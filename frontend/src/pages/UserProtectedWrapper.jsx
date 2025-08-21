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

  useEffect(() => {
    if (!token || token === undefined || token === null) {
      navigate('/')
    }

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
