import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface AdminLoginModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await onSubmit(password);
    if (!result.success) {
      setError(result.error || 'كلمة المرور غير صحيحة.');
      setPassword('');
    }
    // No need to call onClose here, the parent component does it on success.
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-neutral-50 rounded-2xl shadow-xl w-full max-w-sm m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">تسجيل دخول المدير</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 p-1 rounded-full hover:bg-neutral-200">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-4">
           <p className="text-sm text-neutral-600 mb-3">
            هذه المنطقة مخصصة لإدارة المحتوى. أدخل كلمة المرور للوصول.
          </p>
          <label className="block mb-2 text-neutral-700">
            كلمة المرور:
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full mt-1 p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
          </label>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 disabled:bg-brand-800">
            {isLoading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;