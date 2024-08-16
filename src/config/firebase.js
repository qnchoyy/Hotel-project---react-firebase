import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpfPLu8xqrimfNCdEOft8TDVi-RVJbzBA",
    authDomain: "hotel-project-firebase-react.firebaseapp.com",
    projectId: "hotel-project-firebase-react",
    storageBucket: "hotel-project-firebase-react.appspot.com",
    messagingSenderId: "962240503476",
    appId: "1:962240503476:web:937ce19443b0146db241e1",
    measurementId: "G-7PG1RZR1C0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { app, auth, db }