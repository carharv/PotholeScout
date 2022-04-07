// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy95c1vSQ0Je-6hpnvs9PsKb_nqVOjWsA",
  authDomain: "potholescoutgr.firebaseapp.com",
  projectId: "potholescoutgr",
  storageBucket: "potholescoutgr.appspot.com",
  messagingSenderId: "839721341077",
  appId: "1:839721341077:web:800e4870aee7a3cf248b9c",
  measurementId: "G-F3ER027P0F",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export { firebaseConfig };
