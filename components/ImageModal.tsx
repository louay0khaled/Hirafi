import React from 'react';
import { CloseIcon } from './Icons';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  altText?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText = 'Enlarged view' }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={altText}
    >
      <div
        className="relative max-w-3xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 scale-95 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt={altText} className="object-contain w-full h-full" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors"
          aria-label="Close image view"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <style>{`
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoom-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ImageModal;
