// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-a46f0.firebaseapp.com",
  projectId: "mern-blog-a46f0",
  storageBucket: "mern-blog-a46f0.appspot.com",
  messagingSenderId: "961724716646",
  appId: "1:961724716646:web:70c46299d528b7ed6dbfa7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);