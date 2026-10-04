import { createContext, useContext, useMemo, useState } from 'react';
import { startEmergency, endEmergency } from '../services/emergencyService';
import { useLocation } from '../hooks/useLocation';

const EmergencyContext = createContext(null);

export function EmergencyProvider({ children }) {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [emergencyId, setEmergencyId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getLocation } = useLocation();

  const start = async () => {
    try {
      setLoading(true);

      const location = await getLocation();

      const response = await startEmergency({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      const emergency = response.data.data;

      setEmergencyId(emergency._id);
      setActive(true);
      setSeconds(0);

      return emergency;
    } catch (error) {
      console.error('Failed to start emergency:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const stop = async () => {
    try {
      if (emergencyId) {
        await endEmergency(emergencyId);
      }

      setActive(false);
      setEmergencyId(null);
      setSeconds(0);
    } catch (error) {
      console.error('Failed to end emergency:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      active,
      seconds,
      emergencyId,
      loading,
      start,
      stop,
    }),
    [active, seconds, emergencyId, loading]
  );

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export const useEmergency = () => useContext(EmergencyContext);