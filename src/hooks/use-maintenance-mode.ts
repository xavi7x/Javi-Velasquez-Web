'use client';

import { useState, useEffect, useCallback } from 'react';

const MAINTENANCE_KEY = 'portfolio-maintenance-mode';

export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceModeState] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(MAINTENANCE_KEY);
      // Default to false if nothing is stored.
      setIsMaintenanceModeState(storedValue === null ? false : JSON.parse(storedValue));
    } catch (error) {
      console.error("Failed to read maintenance mode from localStorage", error);
      setIsMaintenanceModeState(false); // Fallback to a default if parsing fails
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(isMaintenanceMode));
      } catch (error) {
        console.error("Failed to write maintenance mode to localStorage", error);
      }
    }
  }, [isMaintenanceMode, isLoaded]);
  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === MAINTENANCE_KEY) {
        try {
          if (event.newValue !== null) {
            setIsMaintenanceModeState(JSON.parse(event.newValue));
          }
        } catch (error) {
           console.error("Failed to parse maintenance mode from storage event", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setIsMaintenanceMode = useCallback((value: boolean | ((prevState: boolean) => boolean)) => {
    setIsMaintenanceModeState(value);
  }, []);

  return { isMaintenanceMode, setIsMaintenanceMode, isLoaded };
}
