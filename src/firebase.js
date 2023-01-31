import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "palcoll-42b41.firebaseapp.com",
  projectId: "palcoll-42b41",
  storageBucket: "palcoll-42b41.appspot.com",
  messagingSenderId: "999874361718",
  appId: "1:999874361718:web:ff5211da09ba2c7ffea257"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
