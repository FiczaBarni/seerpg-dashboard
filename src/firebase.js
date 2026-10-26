import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAkpqPsV3Y34In8eD_bymFSC_TTOC04bA",
  authDomain: "seerpg-barni.firebaseapp.com",
  projectId: "seerpg-barni",
  storageBucket: "seerpg-barni.firebasestorage.app",
  messagingSenderId: "917363140807",
  appId: "1:917363140807:web:bbda77a2574c495110f6e2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);