import { gsap } from 'gsap/dist/gsap';
import { useState } from 'react';

const WaitingForDriver = (props) => {
  const ride = props.ride
  const [isUp, setIsUp] = useState(false); // track panel positionc

  // Function to toggle position
  const togglePanel = () => {
    if (!props.WaitingForDriverPannelRef.current) return;
    if (!isUp) {
      gsap.to(props.WaitingForDriverPannelRef.current, {
        bottom: "-43%", // move down
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(props.WaitingForDriverPannelRef.current, {
        bottom: "0%", // move back
        duration: 0.5,
        ease: "power2.out",
      });
    }
    setIsUp(!isUp); // toggle state
  };

  return (
    <div 
      ref={props.WaitingForDriverPannelRef} 
      className="absolute bottom-0 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-1 flex flex-col gap-4">
      
      {/* Toggle Button */}
      <i
        onClick={togglePanel}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-xl ri-git-commit-line cursor-pointer"
      ></i> 

      <div className="flex items-center justify-between">
        <img 
          className="h-20 object-cover object-center" 
          src={props.selectedVehicleImage || "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"} 
          alt="Selected Vehicle" 
        />
        <div className="text-right">
          <h2 className="text-sm font-medium capitalize">
            {ride?.captainId?.fullname.firstname + ' ' + ride?.captainId?.fullname.lastname || "Driver Assigned"}
          </h2>
          <h4 className="text-lg font-semibold -mb-1">{ride?.captainId?.vehicle?.plate || "—"}</h4>
          <p className="text-xs text-gray-600">{ride?.captainId?.vehicle.model || "—"}</p>
          <h1 className="text-lg font-mono text-blue-800">{ride?.otp || "—"}</h1>
          <p className="text-xs text-gray-600">{ride?.distance || "—"} Km</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center mt-5">
        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-300">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600 capitalize">{ride?.pickup || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Drop-off</h3>
              <p className="text-sm -mt-1 text-gray-600 capitalize">{ride?.destination || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare ?? '—'} </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Processing Animation Line */}
      <div className="relative w-full h-1 overflow-hidden bg-gray-200 rounded-full">
        <div className="absolute top-0 left-0 h-1 w-1/4 bg-gray-700 processing-bar"></div>
      </div>
    </div>
  )
}


export default WaitingForDriver
