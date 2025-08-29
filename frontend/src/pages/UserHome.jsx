import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Link, useNavigate} from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import api from '../lib/api';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserDataContext';
import LiveTracking from '../components/LiveTracking';


const UserHome = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropOffLocation, setDropOffLocation] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [selectedVehicleImage, setSelectedVehicleImage] = useState(null);
  const [ride, setRide] = useState(null);
  const [WaitingForDriverPannel, setWaitingForDriverPannel] = useState(false);
  const { sendMessage, connected, socket } = React.useContext(SocketContext);
  const { userData } = React.useContext(UserDataContext);
  const hasJoined = useRef(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const id = userData?._id || localStorage.getItem('_UserId')
    if (!id) {
      return;
    }
    if (!connected) {
      return;
    }
    if (hasJoined.current) {
      return;
    }
    sendMessage('join', { userId: id, role: 'user' });
    hasJoined.current = true;
    return () => {
      hasJoined.current = false;
    };
  }, [sendMessage, userData, connected]);

  const panelRef = useRef(null);
  const VehiclePanelRef = useRef(null);
  const VehicleFoundPanelRef = useRef(null);
  const WaitingForDriverPannelRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    gsap.to(VehiclePanelRef.current, {
      transform: vehiclePanelOpen ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: vehiclePanelOpen ? 3 : 2,
    });
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    gsap.to(VehicleFoundPanelRef.current, {
      transform: vehicleFound ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: vehicleFound ? 4 : 2,
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '70vh' : '0vh',
      display: panelOpen ? 'block' : 'none',
      duration: 0.5,
      ease: 'power2.inOut',
    });
    gsap.to('.nav', {
      zIndex: panelOpen ? 2 : 3,
    });
    gsap.to('.arrow', {
      opacity: panelOpen ? 1 : 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(WaitingForDriverPannelRef.current, {
      transform: WaitingForDriverPannel ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: WaitingForDriverPannel ? 4 : 2,
    });
  }, [WaitingForDriverPannel]);

  useEffect(() => {
    if (!socket) return; 

    const handleConfirmRide = (ride) => {
      if (!ride) {
        console.warn('Received invalid ride confirmation data');
        return;
      }
      setVehicleFound(false);
      setWaitingForDriverPannel(true);
      setRide(ride)
    };
    socket.on('ride-confirmed', handleConfirmRide);

    return () => {
      socket.off('ride-confirmed', handleConfirmRide); 
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return; 

    const handleStartRide = (ride) => {
      if (!ride) {
        console.warn('Received invalid ride confirmation data');
        return;
      }
      setWaitingForDriverPannel(false);
      navigate('/riding', { state: { ride } });
    };
    socket.on('ride-started', handleStartRide);

    return () => {
      socket.off('ride-started', handleStartRide); 
    };
  }, [socket]);

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <img
        className='nav logo w-17 mt-7 ml-5 absolute z-1'
        src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png"
        alt="Uber"
      />

      <Link
        to='/user/logout'
        className='nav absolute right-2 z-1 top-6 h-7 w-7 bg-white flex items-center justify-center border-1 rounded-full'
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>

      <div className='map h-screen w-screen relative z-0'>
        <LiveTracking
          alt="Live Tracking"
        />
      </div>

      <LocationSearchPanel
        setPanelOpen={setPanelOpen}
        setVehiclePanelOpen={setVehiclePanelOpen}
        panelRef={panelRef}
        submitHandler={submitHandler}
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        dropOffLocation={dropOffLocation}
        setDropOffLocation={setDropOffLocation}
      />

      <VehiclePanel
        VehiclePanelRef={VehiclePanelRef}
        setVehiclePanelOpen={setVehiclePanelOpen}
        setVehicleFound={setVehicleFound}
        setSelectedVehicleImage={setSelectedVehicleImage}
        pickupLocation={pickupLocation}
        dropOffLocation={dropOffLocation}
        onRideCreated={(r) => {
          setRide(r);
          setVehicleFound(true);
        }}
      />

      <LookingForDriver
        VehicleFoundPanelRef={VehicleFoundPanelRef}
        setVehicleFound={setVehicleFound}
        selectedVehicleImage={selectedVehicleImage}
        ride={ride}
        onCancel={async () => {
          try {
            const resp = await api.post(`/api/rides/${ride?._id}/cancel`);
            if (resp.status === 200) {
              setRide(null);
              setVehicleFound(false);
            }
          } catch (err) {
            console.error('Failed to cancel ride', err);
          }
        }}
      />

      <WaitingForDriver
        WaitingForDriverPannelRef={WaitingForDriverPannelRef}
        setWaitingForDriverPannel={setWaitingForDriverPannel}
        selectedVehicleImage={selectedVehicleImage}
        ride={ride}
      />
    </div>
  );
};

export default UserHome;