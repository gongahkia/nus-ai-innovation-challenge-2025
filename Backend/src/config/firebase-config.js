import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1EPDFfFYD6tolcQHkhXZMHdGg5j-s0gg",
  authDomain: "yipeeorg.firebaseapp.com",
  projectId: "yipeeorg",
  storageBucket: "yipeeorg.firebasestorage.app",
  messagingSenderId: "480538053884",
  appId: "1:480538053884:web:d04285647c1429d1055b79",
  measurementId: "G-BJ00NMZ1S9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
