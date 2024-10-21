import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAyOjYWMP66MEOB0L43u_4jNc3hIssyzqg",
    authDomain: "bazar-sodai-7c5b7.firebaseapp.com",
    projectId: "bazar-sodai-7c5b7",
    storageBucket: "bazar-sodai-7c5b7.appspot.com",
    messagingSenderId: "782992607773",
    appId: "1:782992607773:web:f885319de06270aa0e54f4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
