'use client';

import { useState, useEffect, useCallback } from 'react';

const AVAILABILITY_KEY = 'portfolio-availability-status';

export function useAvailability() {
  const [isAvailable, setIsAvailableState] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(AVAILABILITY_KEY);
      // Default to true if nothing is stored, for the first-time user experience.
      setIsAvailableState(storedValue === null ? true : JSON.parse(storedValue));
    } catch (error) {
      console.error("Failed to read availability from localStorage", error);
      setIsAvailableState(true); // Fallback to a default if parsing fails
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(isAvailable));
      } catch (error) {
        console.error("Failed to write availability to localStorage", error);
      }
    }
  }, [isAvailable, isLoaded]);
  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AVAILABILITY_KEY) {
        try {
          if (event.newValue !== null) {
            setIsAvailableState(JSON.parse(event.newValue));
          }
        } catch (error) {
           console.error("Failed to parse availability from storage event", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setIsAvailable = useCallback((value: boolean | ((prevState: boolean) => boolean)) => {
    setIsAvailableState(value);
  }, []);

  return { isAvailable, setIsAvailable, isLoaded };
}
