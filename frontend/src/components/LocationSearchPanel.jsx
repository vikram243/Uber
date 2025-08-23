import React, { useState } from 'react'
import api from '../lib/api'

const LocationSearchPanel = (props) => {
  const [activeField, setActiveField] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch suggestions from backend based on user input
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) { setSuggestions([]); return }
    setIsLoading(true)
    try {
      const { data } = await api.get('/api/maps/suggestions', { params: { input } })
      setSuggestions(data)
    } catch (err) {
      console.error('Failed to fetch suggestions', err)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='absolute w-full h-full flex flex-col justify-end top-0 z-2'>
      <div className='h-[30%] flex flex-col justify-center p-5 pt-0 rounded-t-lg shadow-lg bg-white relative'>
        <h2 className='arrow opacity-0 absolute top-0 left-2'>
          <i className="ri-arrow-down-s-line"
            onClick={() => props.setPanelOpen(false)}
          ></i>
        </h2>

        <h1 className='mb-4 text-2xl font-semibold'>Find a trip</h1>

        <form action="" onSubmit={(e) => {
          props.submitHandler(e)
        }} >
          <div className="flex flex-col items-center gap-1 h-16 justify-between absolute left-10 mt-4">
            <div className="w-1.5 h-1.5 border-2 border-black rounded-full"></div>
            <div className="w-0.5 flex-grow bg-black"></div>
            <div className="w-1.5 h-1.5 border-2 border-black"></div>
          </div>

          <input className='bg-[#e8e7e7] py-2 px-14 mb-4 rounded-lg w-full'
            value={props.pickupLocation}
            onFocus={() => { setActiveField('pickup'); props.setPanelOpen(true) }}
            onClick={() => props.setPanelOpen(true)}
            onChange={(e) => { props.setPickupLocation(e.target.value); fetchSuggestions(e.target.value) }}
            type="text"
            placeholder='Add a pickup location' 
          />

          <input className='bg-[#e8e7e7] py-2 px-14 rounded-lg w-full'
            onFocus={() => { setActiveField('dropoff'); props.setPanelOpen(true) }}
            onClick={() => props.setPanelOpen(true)}
            value={props.dropOffLocation}
            onChange={(e) => { props.setDropOffLocation(e.target.value); fetchSuggestions(e.target.value) }}
            type="text"
            placeholder='Enter your drop-off location' 
          />
        </form>
      </div>

      <div ref={props.panelRef} className='h-0 px-5 bg-white display-none'>
        <div 
          className='py-4 h-full overflow-auto'
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
          {isLoading && <div className='text-sm text-gray-500 px-2'>Loading...</div>}
          
          {!isLoading && suggestions.map((sug) => (
            <div
              key={sug.place_id}
              className='flex border-1 py-1 rounded-lg border-white active:border-gray-400 px-2 items-center gap-4 mb-2'
              onClick={() => {
                if (activeField === 'pickup') {
                  props.setPickupLocation(sug.description)
                  setActiveField('dropoff')
                  // keep panel open to allow selecting drop-off next
                } else {
                  props.setDropOffLocation(sug.description)
                  // open vehicle panel only after drop-off is chosen and pickup exists
                  if (props.pickupLocation && sug.description) {
                    props.setVehiclePanelOpen(true)
                  }
                  props.setPanelOpen(false)
                }
              }}
            >
              <i className="ri-map-pin-line"></i>
              <h4>{sug.description}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationSearchPanel