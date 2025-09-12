// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNjyB1PoqDDBAdCV4KGO4p5PgA4BmKovk",
  authDomain: "sportsconnect-d6d51.firebaseapp.com",
  projectId: "sportsconnect-d6d51",
  storageBucket: "sportsconnect-d6d51.firebasestorage.app",
  messagingSenderId: "753285700826",
  appId: "1:753285700826:web:0f2ad5d29224d84f1f19e3",
  measurementId: "G-008MZC63E6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export default firebaseApp
