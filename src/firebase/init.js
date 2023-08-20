// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
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
    measurementId: "G-TZ1N6JP78Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
if (location.hostname === "localhost") {
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    // Point to the Storage emulator running on localhost.
    connectStorageEmulator(storage, "127.0.0.1", 9199);
} 