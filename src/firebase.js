// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCkse5guTFXUmwBFAh2UteLDtleS-1x2mE",
  authDomain: "englishlearn-60ddd.firebaseapp.com",
  projectId: "englishlearn-60ddd",
  storageBucket: "englishlearn-60ddd.firebasestorage.app",
  messagingSenderId: "826071129117",
  appId: "1:826071129117:web:9556bc0dd5af28b4283af4",
  measurementId: "G-CGRT4DE4V1"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

export { db };
