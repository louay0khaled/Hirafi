import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast from '../components/Toast';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');

  const showToast = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleAnimationEnd = () => {
    setMessage('');
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <Toast message={message} onAnimationEnd={handleAnimationEnd} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
