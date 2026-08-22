import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgdOizGoIbNBpJIz3_JDeRSXc3-oNAfZs",
  authDomain: "internship-d773f.firebaseapp.com",
  projectId: "internship-d773f",
  storageBucket: "internship-d773f.firebasestorage.app",
  messagingSenderId: "803795620520",
  appId: "1:803795620520:web:c6afb9a4dc7790aba6289d",
  measurementId: "G-FZMKF20NQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
