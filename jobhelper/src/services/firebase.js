import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQ2rLLCN_Ev0OQeR9_KLQ2eJluLU-nZQY",
  authDomain: "jobhelper-d0a26.firebaseapp.com",
  projectId: "jobhelper-d0a26",
  storageBucket: "jobhelper-d0a26.firebasestorage.app",
  messagingSenderId: "842112208756",
  appId: "1:842112208756:web:f5a766595fcb6706fb2621"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
