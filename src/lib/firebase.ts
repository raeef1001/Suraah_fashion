// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDro0NhkcJOZ1EmXXjmpvznhs8cS8RPeEY",
  authDomain: "suraahfasionproduction.firebaseapp.com",
  projectId: "suraahfasionproduction",
  storageBucket: "suraahfasionproduction.firebasestorage.app",
  messagingSenderId: "1086059462902",
  appId: "1:1086059462902:web:ee2f7bd17d766df282acd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;