import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Initialize Telegram Web App if available
if (window.Telegram?.WebApp) {
  try {
    window.Telegram.WebApp.ready();
    // Telegram Web App initialized successfully
  } catch (error) {
    // Failed to initialize Telegram Web App
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
