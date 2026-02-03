// Firebase client SDK setup for frontend
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJHhnfGFakfnttzZnUxbQ6kNz1J2UWdfM",
  authDomain: "vp-s-feedback-system.firebaseapp.com",
  projectId: "vp-s-feedback-system",
  storageBucket: "vp-s-feedback-system.firebasestorage.app",
  messagingSenderId: "28543489068",
  appId: "1:28543489068:web:a880ed37533790be5f2d89",
  measurementId: "G-HTCJXJ9Z7T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
