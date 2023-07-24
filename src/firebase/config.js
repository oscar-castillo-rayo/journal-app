// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGSzBlNxCv_nhVGuevufQuqTvUo44YJYY",
  authDomain: "charismatic-age-371221.firebaseapp.com",
  projectId: "charismatic-age-371221",
  storageBucket: "charismatic-age-371221.appspot.com",
  messagingSenderId: "364110625722",
  appId: "1:364110625722:web:f0ddea5a26ac2d896cfb83",
  measurementId: "G-K3VLYVKQJM",
};

// Initialize Firebase
//const analytics = getAnalytics(firebaseApp);

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
