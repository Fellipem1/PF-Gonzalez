// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn7tM3BjzpxqaQMUKGA75My9U7PB85tA8",
  authDomain: "shop-fellipem.firebaseapp.com",
  projectId: "shop-fellipem",
  storageBucket: "shop-fellipem.firebasestorage.app",
  messagingSenderId: "504708774296",
  appId: "1:504708774296:web:5338ed149081cb717d13ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)