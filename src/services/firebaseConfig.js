//DineTime/firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7-S9Cglbi5QmOoM8Qj5MZ6NCj7mJEAbY",
  authDomain: "maz-scheduler.firebaseapp.com",
  projectId: "maz-scheduler",
  storageBucket: "maz-scheduler.firebasestorage.app",
  messagingSenderId: "127728525241",
  appId: "1:127728525241:web:a7aafade62f07b9d13e068",
  measurementId: "G-R92ZQ0P3C3",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
// Realtime Database
export const rtdb = getDatabase(app);
//const analytics = getAnalytics(app);
//export { db };
