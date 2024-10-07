// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-view-f8e0a.firebaseapp.com",
  projectId: "estate-view-f8e0a",
  storageBucket: "estate-view-f8e0a.appspot.com",
  messagingSenderId: "792316203257",
  appId: "1:792316203257:web:b62d41ae5f8f2aab8ad228",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
