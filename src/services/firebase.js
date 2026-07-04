import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwNeZNHxWK1eAKRbNVMRUZak6w1FQV770",
  authDomain: "savebite-ai.firebaseapp.com",
  projectId: "savebite-ai",
  storageBucket: "savebite-ai.firebasestorage.app",
  messagingSenderId: "576990687961",
  appId: "1:576990687961:web:b740110f07c612c19144c8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);