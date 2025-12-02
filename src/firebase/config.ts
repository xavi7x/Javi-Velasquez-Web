import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "velsquez-digital",
  appId: "1:756479849375:web:08c8fd2feadc9fa4f243aa",
  apiKey: "AIzaSyC5Z-W2Bufk2IStfoU_a-BY1MfOOGPBZNk",
  authDomain: "velsquez-digital.firebaseapp.com",
  storageBucket: "velsquez-digital.firebasestorage.app",
  measurementId: "",
  messagingSenderId: "756479849375"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export the config itself if needed elsewhere
export { firebaseConfig };