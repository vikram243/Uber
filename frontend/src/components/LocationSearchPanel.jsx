import React from 'react'

const LocationSearchPanel = (props) => {
  const locations = [
    { id: 1, name: 'Kyoto City, Kyoto Prefecture, Japan' },
    { id: 2, name: 'Oia Village, Santorini Island, South Aegean, Greece' },
    { id: 3, name: 'Banff Town, Alberta Province, Canada' },
    { id: 4, name: 'Reykjavík City, Capital Region, Iceland' },
    { id: 5, name: 'Udaipur City, Rajasthan State, India' },
    { id: 6, name: 'Machu Picchu, Cusco Region, Peru' },
    { id: 7, name: 'Queenstown, Otago Region, South Island, New Zealand' },
    { id: 8, name: 'Amalfi Town, Salerno Province, Campania Region, Italy' },
    { id: 9, name: 'Petra Archaeological Site, Maan Governorate, Jordan' },
    { id: 10, name: 'Kailas nagar semra kala, Sikandari Sarai Bhopal, M.P.' },
    { id: 11, name: 'Mount Fuji, Yamanashi Prefecture, Japan' },
    { id: 12, name: 'Santorini Island, South Aegean, Greece' },
    { id: 13, name: 'Banff National Park, Alberta Province, Canada' },
    { id: 14, name: 'Reykjavík City, Capital Region, Iceland' },
    { id: 15, name: 'Udaipur City, Rajasthan State, India' },
    { id: 16, name: 'Machu Picchu, Cusco Region, Peru' },
    { id: 17, name: 'Queenstown, Otago Region, South Island, New Zealand' },
    { id: 18, name: 'Amalfi Coast, Salerno Province, Campania Region, Italy' },
    { id: 19, name: 'Petra Archaeological Site, Maan Governorate, Jordan' },
    { id: 20, name: 'Kailas nagar semra kala Bhopal M.P.' }
  ]

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
            onClick={() => props.setPanelOpen(true)}
            onChange={(e) => props.setPickupLocation(e.target.value)}
            type="text"
            placeholder='Add a pickup location' />
          <input className='bg-[#e8e7e7] py-2 px-14 rounded-lg w-full'
            onClick={() => props.setPanelOpen(true)}
            value={props.dropOffLocation}
            onChange={(e) => props.setDropOffLocation(e.target.value)}
            type="text"
            placeholder='Enter your drop-off location' />
        </form>
      </div>
      <div ref={props.panelRef} className='h-0 px-5 bg-white display-none'>
        <div className='py-4 h-full overflow-auto'
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
          {
            locations.map((location) => (
              <div
                key={location.id}
                className='flex border-1 py-1 rounded-lg border-white active:border-gray-400 px-2 items-center gap-4 mb-2'
                onClick={() => {
                  props.setVehiclePanelOpen(true)
                  props.setPanelOpen(false)
                }}
              >
                <i className="ri-map-pin-line"></i>
                <h4>{location.name}</h4>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default LocationSearchPanel