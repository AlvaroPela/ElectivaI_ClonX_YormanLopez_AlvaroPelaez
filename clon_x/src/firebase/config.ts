import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: move the keys to environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDZkcPHrxAioRz_C3bMs4ZbWrlFcXJ0K_w",
  authDomain: "clon-x-app-electiva1.firebaseapp.com",
  projectId: "clon-x-app-electiva1",
  storageBucket: "clon-x-app-electiva1.firebasestorage.app",
  messagingSenderId: "835791216416",
  appId: "1:835791216416:web:1bb42c66e7f13da6bbc145"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);

export const FirebaseAuth = getAuth(FirebaseApp);

export const FirebaseDB = getFirestore(FirebaseApp);
