import { gsap } from 'gsap/dist/gsap';
import { useState } from 'react';

const LookingForDriver = (props) => {
  const ride = props.ride;
  const [isUp, setIsUp] = useState(false); // track panel position

  // Function to toggle position
  const togglePanel = () => {
    if (!props.VehicleFoundPanelRef.current) return;

    if (!isUp) {
      gsap.to(props.VehicleFoundPanelRef.current, {
        bottom: "-51%", // move down
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(props.VehicleFoundPanelRef.current, {
        bottom: "0%", // move back
        duration: 0.5,
        ease: "power2.out",
      });
    }
    setIsUp(!isUp); // toggle state
  };

  return (
    <div
      ref={props.VehicleFoundPanelRef}
      className="looking absolute bottom-0 min-h-4/5 translate-y-full bg-white w-full p-4 rounded-t-lg shadow-lg z-1 flex flex-col gap-4"
    >
      <h3 className="text-2xl font-semibold mt-2">Looking for a Driver</h3>

      {/* Toggle Button */}
      <i
        onClick={togglePanel}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-xl ri-git-commit-line cursor-pointer"
      ></i>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-20 object-cover object-center"
          src={
            props.selectedVehicleImage ||
            "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png"
          }
          alt="Selected Vehicle"
        />

        {/* Animated dots */}
        <div className="absolute top-9 right-22 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
        </div>

        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-300">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600 capitalize">
                {ride?.pickup || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Drop-off</h3>
              <p className="text-sm -mt-1 text-gray-600 capitalize">
                {ride?.destination || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{ride?.fare ?? "—"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <button
          className="w-[90%] absolute bottom-5 bg-red-500 text-white font-medium p-2 rounded-lg"
          onClick={props.onCancel}
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;
