import React, { useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

interface ToastProps {
  message: string;
  onAnimationEnd: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 3500); // Must be same duration as animation

    return () => clearTimeout(timer);
  }, [message, onAnimationEnd]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-1/2 translate-x-1/2 sm:right-6 sm:translate-x-0 bg-neutral-800 text-white py-3 px-5 rounded-full shadow-lg flex items-center toast-animate z-[100]">
      <CheckCircleIcon className="w-6 h-6 me-3 text-brand-400" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;