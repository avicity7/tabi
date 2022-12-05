// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBr5nMrSajpvIE-l2qOQzDR84nDEqvZBvs",
    authDomain: "tabi-de2c0.firebaseapp.com",
    databaseURL: "https://tabi-de2c0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tabi-de2c0",
    storageBucket: "tabi-de2c0.appspot.com",
    messagingSenderId: "800940892461",
    appId: "1:800940892461:web:98561e9d1bf1cd087b33a4",
    measurementId: "G-L0JR51E6RV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

