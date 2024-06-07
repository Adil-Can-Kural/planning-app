// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtnJhYTPwf86mEc_sCoOWE3MWIRPNgCXs",
  authDomain: "planingapp-c62cb.firebaseapp.com",
  projectId: "planingapp-c62cb",
  storageBucket: "planingapp-c62cb.appspot.com",
  messagingSenderId: "28075042616",
  appId: "1:28075042616:web:ed2eed5b155e9f383a03cd",
  measurementId: "G-JQ1RJDR0QH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default app;
export { db };