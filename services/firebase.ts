import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJbstPspmY__-Um6csn4IsLPGZO3dAd9o",
  authDomain: "anime-f899d.firebaseapp.com",
  projectId: "anime-f899d",
  storageBucket: "anime-f899d.firebasestorage.app",
  messagingSenderId: "26047491905",
  appId: "1:26047491905:web:37f8a827b0a1d4f436bbc0",
  measurementId: "G-PJ1SJMGTGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);