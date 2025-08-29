import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainDataContext'
import api from '../lib/api'

const CaptainProtectedWrapper = ({
  children
}) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { setCaptain } = useContext(CaptainDataContext)
  const [, setLoading] = useState(true)

  // Effect to check if the token is valid and fetch captain data
  // If the token is invalid or not present, it redirects to the home page
  useEffect(() => {
    if (!token || token === undefined || token === null) {
      navigate('/')
    }

    // Function to fetch captain data
    // It sends a GET request to the server with the token in the headers
    const fetchCaptainData = async () => {
      try {
        const response = await api.get(`/api/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.status === 200) {
          setCaptain(response.data.captain)
          localStorage.setItem('_CaptainId', response.data.captain._id)
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('_CaptainId')
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching captain data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('_CaptainId')
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
