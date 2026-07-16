import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#191c1e',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        },
        success: {
          iconTheme: {
            primary: '#16a34a',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>,
);