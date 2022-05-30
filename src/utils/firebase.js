// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCyONNyPrBSW_fy-4WWh5Lwp1TwLRuGqwQ",

  authDomain: "af-project-3d9e5.firebaseapp.com",

  databaseURL: "https://af-project-3d9e5.firebaseio.com",

  projectId: "af-project-3d9e5",

  storageBucket: "af-project-3d9e5.appspot.com",

  messagingSenderId: "35237528469",

  appId: "1:35237528469:web:da1dde7beb2d40652bec9c",

  measurementId: "G-TZ1N6JP78Q",
};

// Initialize Firebase

const firebase = initializeApp(firebaseConfig);

export default firebase;
