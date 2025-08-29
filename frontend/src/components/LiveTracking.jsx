import React, { useEffect, useRef, useState } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const LiveTracking = () => {
  const [position, setPosition] = useState(null);
  const [path, setPath] = useState([]);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!apiKey) return;

    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not available in this browser.');
      return;
    }
    // Poll the current position every 10 seconds and also fetch immediately.
    let intervalId = null;
    const fetchPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setPosition(newPos);
          setPath((p) => [...p, newPos]);

          if (mapRef.current && typeof mapRef.current.panTo === 'function') {
            mapRef.current.panTo(newPos);
          }
        },
        (err) => console.error('Error getting position', err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    };

    // initial fetch
    fetchPosition();
    // then poll every 10 seconds
    intervalId = setInterval(fetchPosition, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [apiKey]);

  const containerStyle = { width: '100%', height: '85%' };
  const defaultCenter = position || { lat: 24.8607, lng: 67.0011 };

  if (!apiKey) {
    return (
      <div style={{ padding: 12 }}>
        <strong>Live Tracking:</strong> missing Google Maps API key. Please set MAPS_API_KEY in your frontend
      </div>
    );
  }

  return (
    <div className="object-cover h-screen w-screen">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={16}
          onLoad={(map) => (mapRef.current = map)}
          options={{
            disableDefaultUI: true, // remove default UI
          }}
        >
          {position && (
            <Marker
              position={position}
              title="You are here"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}
          {path.length > 1 && (
            <Polyline path={path} options={{ strokeColor: "#00E676", strokeWeight: 4 }} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default LiveTracking;
