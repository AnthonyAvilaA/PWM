import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAMqfSeuX1zIwTdbBEaozW9neaAwW7Nfgc",
  authDomain: "argony-30570.firebaseapp.com",
  projectId: "argony-30570",
  storageBucket: "argony-30570.firebasestorage.app",
  messagingSenderId: "679835672082",
  appId: "1:679835672082:web:8870bf7d6e1aef998b42cb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);