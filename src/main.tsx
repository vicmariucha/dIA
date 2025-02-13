import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './styles/global.css';

// Importar e inicializar o Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDKeoRmrGnpVGmio72zM894JpGWn2BuWA8",
  authDomain: "diapp-3e683.firebaseapp.com",
  projectId: "diapp-3e683",
  storageBucket: "diapp-3e683.appspot.com",
  messagingSenderId: "356276976589",
  appId: "1:356276976589:android:e51736efd09441a4696284",
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
