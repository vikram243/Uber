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
        <div className='py-4 h-full overflow-auto'
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
            onClick={() => {
                props.setVehiclePanelOpen(true)
                props.setPanelOpen(false)
            }}>
            {
                locations.map((location) => (
                    <div className='flex border-1 py-1 rounded-lg border-white active:border-gray-400 px-2 items-center gap-4 mb-2'>
                        <i class="ri-map-pin-line"></i>
                        <h4>{location.name}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel
