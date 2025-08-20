import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainDataContext'
import axios from 'axios'

const CaptainProtectedWrapper = ({
  children
}) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { setCaptain } = useContext(CaptainDataContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || token === undefined || token === null) {
      navigate('/')
    }

    const fetchCaptainData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.status === 200) {
          setCaptain(response.data.captain)
        } else {
          localStorage.removeItem('token')
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching captain data:', error)
        localStorage.removeItem('token')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchCaptainData()

  }, [token, navigate, setCaptain])

  return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectedWrapper
