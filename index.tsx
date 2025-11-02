
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdminProvider } from './context/AdminContext';
import { ToastProvider } from './context/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AdminProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AdminProvider>
  </React.StrictMode>
);

// Register the service worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js') // Use the compiled JS file in production
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
