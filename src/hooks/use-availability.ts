'use client';

import { useState, useEffect, useCallback } from 'react';

const AVAILABILITY_KEY = 'portfolio-availability-status';

export function useAvailability() {
  const [isAvailable, setIsAvailableState] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true; // Default to available on the server
    }
    const storedValue = localStorage.getItem(AVAILABILITY_KEY);
    return storedValue !== null ? JSON.parse(storedValue) : true; // Default to true if nothing is stored
  });

  // Effect to update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(isAvailable));
  }, [isAvailable]);
  
  // Effect to listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AVAILABILITY_KEY) {
        setIsAvailableState(event.newValue !== null ? JSON.parse(event.newValue) : true);
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

  return { isAvailable, setIsAvailable };
}
