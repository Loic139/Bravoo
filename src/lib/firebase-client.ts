import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcQZU-kFe2Q7Fo4PPlyIVErn7F8Qu3I50",
  authDomain: "bravoo-6c00e.firebaseapp.com",
  projectId: "bravoo-6c00e",
  storageBucket: "bravoo-6c00e.firebasestorage.app",
  messagingSenderId: "181314140421",
  appId: "1:181314140421:web:b3c15180e751452d159f6c",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
