'use client';

import { doc, setDoc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';

interface AvailabilitySettings {
  isAvailable: boolean;
}

export function useAvailability() {
  const firestore = useFirestore();

  const availabilityRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'availability');
  }, [firestore]);

  const { data, isLoading: isLoaded } = useDoc<AvailabilitySettings>(availabilityRef, true);

  const setIsAvailable = (value: boolean | ((prevState: boolean) => boolean)) => {
    if (!availabilityRef) return;
    
    const newValue = typeof value === 'function' ? value(data?.isAvailable ?? false) : value;

    // Persist to Firestore
    setDoc(availabilityRef, { isAvailable: newValue }, { merge: true }).catch(err => {
      console.error("Failed to update availability status in Firestore:", err);
    });
  };

  // If data hasn't been loaded yet, we can assume a default or wait.
  // Defaulting to 'true' if the document doesn't exist yet for a good first-time experience.
  const isAvailable = data === null ? true : data.isAvailable;

  return { isAvailable, setIsAvailable, isLoaded };
}
