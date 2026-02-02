import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJbstPspmY__-Um6csn4IsLPGZO3dAd9o",
  authDomain: "anime-f899d.firebaseapp.com",
  projectId: "anime-f899d",
  storageBucket: "anime-f899d.firebasestorage.app",
  messagingSenderId: "26047491905",
  appId: "1:26047491905:web:74fdfe8d0ddb5e9336bbc0",
  measurementId: "G-LN18HPWKQL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
