'use client';

import { useState, useEffect, useCallback } from 'react';

const AVAILABILITY_KEY = 'portfolio-availability-status';

export function useAvailability() {
  // 1. Initialize state to a default (e.g., false) that is consistent on server and client.
  const [isAvailable, setIsAvailableState] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // 2. Use useEffect to read from localStorage only on the client-side after mount.
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(AVAILABILITY_KEY);
      if (storedValue !== null) {
        setIsAvailableState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error("Failed to read availability from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  // Effect to update localStorage when state changes
  useEffect(() => {
    // Only write to localStorage if the state has been loaded from it first.
    if (isLoaded) {
      try {
        localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(isAvailable));
      } catch (error) {
        console.error("Failed to write availability to localStorage", error);
      }
    }
  }, [isAvailable, isLoaded]);
  
  // Effect to listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AVAILABILITY_KEY) {
        try {
          setIsAvailableState(event.newValue !== null ? JSON.parse(event.newValue) : true);
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
