import React from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-neutral-50 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-neutral-200 sticky top-0 bg-neutral-50 z-10">
          <h2 id="modal-title" className="text-xl font-bold text-neutral-800">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 p-1 rounded-full hover:bg-neutral-200">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </header>
        <div className="p-4 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;