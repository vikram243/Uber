import React, { useRef, useState } from 'react'
import VerifyOtp from '../components/VerifyOtp'
import { useGSAP } from '@gsap/react/dist';
import { gsap } from 'gsap/dist/gsap';
import RideDetailsCaptainRiding from '../components/RideDetailsCaptainRiding';
import CompleteRide from '../components/CompleteRide';
import { useLocation } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainDataContext';

const CaptainRiding = () => {
  const [otpPanel, setOtpPanel] = useState(false);
  const [rideDetailsPanel, setRideDetailsPanel] = useState(true);
  const [completeRide, setCompleteRide] = useState(false);
  const otpPanelRef = useRef(null)
  const rideDetailsPanelRef = useRef(null)
  const completeRideRef = useRef(null)
  const location = useLocation();
  const ride = location.state?.ride;

  /* otpPanel Animation */
  useGSAP(() => {
    // ensure the DOM node exists before animating (prevents GSAP "target null not found")
    if (!otpPanelRef.current) return

    gsap.to(otpPanelRef.current, {
      transform: otpPanel ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: otpPanel ? 4 : 2,
    })
  }, [otpPanel])

  /* rideDetailsPanel Animation */ 
  useGSAP(() => {
    // ensure the DOM node exists before animating (prevents GSAP "target null not found")
    if (!rideDetailsPanelRef.current) return

    gsap.to(rideDetailsPanelRef.current, {
      transform: rideDetailsPanel ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: rideDetailsPanel ? 4 : 2,
    })
  }, [rideDetailsPanel])

  /* completeRide Animation */ 
  useGSAP(() => {
    // ensure the DOM node exists before animating (prevents GSAP "target null not found")
    if (!completeRideRef.current) return

    gsap.to(completeRideRef.current, {
      transform: completeRide ? 'translateY(0%)' : 'translateY(100%)',
      duration: 0.5,
      ease: 'power2.inOut',
      zIndex: completeRide ? 4 : 2,
    })
  }, [completeRide])

  return (
    <div className='h-screen w-screen overflow-hidden relative'>
      {/* Logo */}
      <div className='flex absolute items-center '>
        <img className='w-17 mt-7 mb-8 ml-5' src="https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png" alt="Uber" />
        <img className='w-6 ml-1' src="https://th.bing.com/th/id/R.7c9170d585fd3562fdf8ce1d49fd7410?rik=NleSh8FIn3wZzQ&riu=http%3a%2f%2fpngimg.com%2fuploads%2fuber%2fuber_PNG13.png&ehk=qmQ99VMq88QwqC5C9VL%2f7b9hZqS5EvFF0kDjGQLgyQE%3d&risl=&pid=ImgRaw&r=0" alt="Captain" />
      </div>

      {/* Map */}
      <div className='w-full h-5/6'>
        <img
          className='object-cover h-full w-full'
          src="https://www.google.com/maps/d/thumbnail?mid=1-1KSpXvMbW-ya8HXrB1BumVcFRI"
          alt="Map"
        />
      </div>

      {/* Ride Details */}
      <RideDetailsCaptainRiding
        ref={rideDetailsPanelRef}
        setOtpPanel={setOtpPanel}
        setRideDetailsPanel={setRideDetailsPanel}
        ride={ride}
      />

      {/* Otp */}
      <VerifyOtp
        ref={otpPanelRef}
        setOtpPanel={setOtpPanel}
        setRideDetailsPanel={setRideDetailsPanel}
        setCompleteRide={setCompleteRide}
        ride={ride}
      />

      {/* Complete Ride */}
      <CompleteRide
        ref={completeRideRef}
        setCompleteRide={setCompleteRide}
        ride={ride}
      />

    </div>
  )
}

export default CaptainRiding
