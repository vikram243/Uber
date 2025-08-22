import React, { useState } from 'react';
import { CaptainDataContext } from './CaptainDataContext'; 

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to update captain data
  const updateCaptain = (captainData) => {
    setCaptain(captainData);
  };

  // Context value to be provided to children components
  // This includes captain data, loading state, error state, and the update function
  const value = {
    captain,
    setCaptain,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateCaptain
  };

  // Provide the context value to children components
  return (
    <CaptainDataContext.Provider value={value}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;