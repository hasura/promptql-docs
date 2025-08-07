import React, { useState } from 'react';

export const TestControls = ({ activeStreamingRequest, abortControllersRef }) => {
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);

  const toggleNetworkState = () => {
    if (!isSimulatingOffline) {
      // Going offline - force disconnect
      if (activeStreamingRequest.current) {
        const controller = abortControllersRef.current.get(activeStreamingRequest.current);
        if (controller) {
          controller.abort();
          console.log("🧪 SIMULATED NETWORK DISCONNECT - Testing background polling");
        }
      }
      setIsSimulatingOffline(true);
    } else {
      // Coming back online
      console.log("🧪 SIMULATED NETWORK RECONNECT - Back online");
      setIsSimulatingOffline(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <button 
      onClick={toggleNetworkState} 
      style={{
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: isSimulatingOffline ? '#22c55e' : 'red', 
        color: 'white',
        zIndex: 9999,
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {isSimulatingOffline ? '🧪 Reconnect' : '🧪 Disconnect'}
    </button>
  );
};
